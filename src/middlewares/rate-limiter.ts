import * as Sentry from "@sentry/node";
import type { NextFunction, Request, Response } from "express";
import HttpErrors from "http-errors";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { FEATURE_RATE_LIMIT } from "../config/env";
import { getNewRedisClient } from "../connectors/redis";
import {
  getUserFromAuthenticatedSession,
  isWithinAuthenticatedSession,
} from "../managers/session/authenticated";
import { getEmailFromUnauthenticatedSession } from "../managers/session/unauthenticated";

const redisClient = getNewRedisClient({
  enableOfflineQueue: false,
});

const ipRateLimiterMiddlewareFactory =
  (rateLimiter: RateLimiterRedis) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (FEATURE_RATE_LIMIT) {
        await rateLimiter.consume(req.ip);
      }
      next();
    } catch (e) {
      next(new HttpErrors.TooManyRequests());
    }
  };

const emailRateLimiterMiddlewareFactory =
  (rateLimiter: RateLimiterRedis) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!FEATURE_RATE_LIMIT) {
      } else if (isWithinAuthenticatedSession(req.session)) {
        const { email } = getUserFromAuthenticatedSession(req);
        await rateLimiter.consume(email);
      } else if (getEmailFromUnauthenticatedSession(req)) {
        await rateLimiter.consume(getEmailFromUnauthenticatedSession(req)!);
      } else {
        const err = new Error("Falling back to ip rate limiting.");
        Sentry.captureException(err);
        // Fall back to ip rate limiting to avoid security flaw
        await rateLimiter.consume(req.ip);
      }

      return next();
    } catch (e) {
      next(new HttpErrors.TooManyRequests());
    }
  };

export const rateLimiterMiddleware = ipRateLimiterMiddlewareFactory(
  new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rate-limiter",
    points: 20, // 20 requests
    duration: 60, // per minute per IP
  }),
);

export const apiRateLimiterMiddleware = ipRateLimiterMiddlewareFactory(
  new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rate-limiter-api",
    points: 42, // 42 API requests
    duration: 1, // per second per IP
  }),
);

export const passwordRateLimiterMiddleware = emailRateLimiterMiddlewareFactory(
  new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rate-limiter-password",
    points: 10, // 10 requests
    duration: 5 * 60, // per 5 minutes per email
  }),
);

export const authenticatorRateLimiterMiddleware =
  emailRateLimiterMiddlewareFactory(
    new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: "rate-limiter-totp",
      points: 5, // 5 requests
      duration: 15 * 60, // per 15 minutes per email
    }),
  );

export const resetPasswordRateLimiterMiddleware =
  emailRateLimiterMiddlewareFactory(
    new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: "rate-limiter-reset-password",
      points: 5, // 5 requests
      duration: 15 * 60, // per 15 minutes per email
    }),
  );

export const sendMagicLinkRateLimiterMiddleware =
  emailRateLimiterMiddlewareFactory(
    new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: "rate-limiter-send-magic-link",
      points: 5, // 5 requests
      duration: 15 * 60, // per 15 minutes per email
    }),
  );
