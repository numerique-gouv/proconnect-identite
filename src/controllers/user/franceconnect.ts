//

import { createOidcChecks } from "@gouvfr-lasuite/proconnect.identite/managers/franceconnect";
import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { FRANCECONNECT_CALLBACK_URL, HOST } from "../../config/env";
import { OidcError } from "../../config/errors";
import {
  getFranceConnectRedirectUrl,
  getFranceConnectUser,
} from "../../connectors/franceconnect";
import {
  getUserFromAuthenticatedSession,
  updateUserInAuthenticatedSession,
} from "../../managers/session/authenticated";
import { FranceConnectOidcSessionSchema } from "../../managers/session/franceconnect";
import { updateFranceConnectUserInfo } from "../../managers/user";

//

export async function postFranceConnectController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { nonce, state } = createOidcChecks();
    req.session.nonce = nonce;
    req.session.state = state;
    req.session.redirectTo =
      "/personal-information?notification=personal_information_update_via_franceconnect_success";

    const url = await getFranceConnectRedirectUrl(nonce, state);

    return res.redirect(url.toString());
  } catch (error) {
    next(error);
  }
}

//

export async function getFranceConnectOidcCallbackController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const errorQuery = await z
      .object({ error: z.string(), error_description: z.string() })
      .safeParseAsync(req.query);

    if (errorQuery.success) {
      const { error, error_description } = errorQuery.data;
      throw new OidcError(error, error_description);
    }
    const { code } = await z.object({ code: z.string() }).parseAsync(req.query);
    console.log({ code });
    console.trace();

    const { nonce, state, redirectTo } =
      await FranceConnectOidcSessionSchema.parseAsync(req.session);
    const franceconnectUserInfo = await getFranceConnectUser({
      code,
      currentUrl: `${HOST}${FRANCECONNECT_CALLBACK_URL}${req.url.substring(req.path.length)}`,
      expectedNonce: nonce,
      expectedState: state,
    });
    console.log({ franceconnectUserInfo, redirectTo });
    console.trace();

    const { id: userId } = getUserFromAuthenticatedSession(req);

    const updatedUser = await updateFranceConnectUserInfo(
      userId,
      franceconnectUserInfo,
    );
    updateUserInAuthenticatedSession(req, updatedUser);

    console.log({ updatedUser, userId });
    console.trace();

    return res.redirect(redirectTo);
  } catch (error) {
    next(error);
  }
}
