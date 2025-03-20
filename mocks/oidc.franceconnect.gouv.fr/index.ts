//

import {
  FranceConnectUserInfoResponseSchema,
  type FranceConnectUserInfoResponse,
} from "@gouvfr-lasuite/proconnect.identite/types";
import express from "express";
import helmet from "helmet";
import { CompactSign, generateKeyPair } from "jose";
import morgan from "morgan";
import { z } from "zod";
import { HOST } from "../../src/config/env";
import SelectPage from "./select.page";
import wellKnown from "./well-known";

//

const SUB_VALUE = "🎭 FranceConnect Sub";
const codeMap = new Map<
  string,
  { client_id: string; nonce: string; state: string; redirect_uri: string }
>();

const TAGNAME = `[🎭]`;
const DEFAULT_USERINFO: FranceConnectUserInfoResponse = {
  birthdate: new Date("2001-01-01"),
  birthplace: "Internet",
  family_name: "Dupont",
  gender: "male",
  given_name: "Jean",
  preferred_username: "Dulac",
  sub: SUB_VALUE,
};
let userinfo: FranceConnectUserInfoResponse;

morgan.token("prefix", () => TAGNAME);
export const FranceconnectFrontChannel = express()
  .use(morgan(":prefix :method :url :status :response-time ms"))
  .get("/", (_req, res) => {
    return res.send("🎭 FranceConnect theater");
  })
  .get("/api/v2/.well-known/openid-configuration", (_req, res) => {
    return res.json(wellKnown);
  })
  .get("/api/v2/authorize", async (req, res) => {
    const codeValue = `🦆_${Date.now()}`;
    const query = z
      .object({
        client_id: z.string(),
        redirect_uri: z.string(),
        response_type: z.string(),
        scope: z.string(),
        state: z.string(),
        nonce: z.string(),
      })
      .parse(req.query);

    const { client_id, redirect_uri, state, nonce } = query;
    codeMap.set(codeValue, { client_id, nonce, redirect_uri, state });

    return res
      .type("html")
      .send(SelectPage({ codeValue, userinfo: DEFAULT_USERINFO }));
  })
  .get("/api/v2/userinfo", (_, res) => {
    return res.json(userinfo);
  })
  .post(
    "/interaction/:code/login",
    helmet(),
    express.urlencoded(),
    async (req, res, next) => {
      const { code } = req.params;
      const info = await FranceConnectUserInfoResponseSchema.omit({
        sub: true,
      }).safeParseAsync(req.body);
      if (info.error) {
        return next(info.error);
      }

      userinfo = {
        ...DEFAULT_USERINFO,
        ...info.data,
        sub: SUB_VALUE,
      };

      const codeObj = codeMap.get(code);
      if (!codeObj) return next(new Error("Invalid authorization code"));

      const { redirect_uri } = codeObj;
      const redirectParams = new URLSearchParams({
        code,
        iss: `${HOST}${req.baseUrl}/api/v2`,
        state: codeObj.state,
      });
      return res.redirect(`${redirect_uri}?${redirectParams}`);
    },
  )
  .post("/api/v2/token", express.urlencoded(), async (req, res, next) => {
    const requestData = z
      .object({
        code: z.string().min(1, "Authorization code is required"),
      })
      .safeParse(req.body);
    if (!requestData.success) {
      return next(requestData.error);
    }

    const code = String(requestData.data.code);
    const codeObj = codeMap.get(code);
    if (!codeObj) {
      return next(new Error("Invalid authorization code"));
    }
    codeMap.delete(code);
    const { client_id, nonce } = codeObj;

    const { privateKey } = await generateKeyPair("ES256");

    const id_token = await new CompactSign(
      Buffer.from(
        JSON.stringify({
          iss: `${HOST}${req.baseUrl}/api/v2`,
          aud: client_id,
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
          nonce,
          sub: SUB_VALUE,
        }),
      ),
    )
      .setProtectedHeader({
        alg: "ES256",
        typ: "JWT",
      })
      .sign(privateKey);

    return res.json({
      access_token: "==MOCK_FC_ACCESS_TOKEN==",
      token_type: "bearer",
      expires_in: 3600,
      id_token,
      refresh_token: "==MOCK_FC_REFRESH_TOKEN==",
      scope: Object.keys(DEFAULT_USERINFO).join(" "),
    });
  })
  .use((req, _res, next) => {
    console.warn(
      [
        `Warning: intercepted a request without a matching request handler:`,
        "",
        `• ${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`,
        "",
        `If you still wish to intercept this unhandled request, please create a request handler for it.`,
      ]
        .map((line) => `${TAGNAME} ${line}`)
        .join("\n"),
    );

    next();
  });
