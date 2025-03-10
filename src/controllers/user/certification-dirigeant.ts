//

import { createOidcChecks } from "@gouvfr-lasuite/proconnect.identite/managers/franceconnect";
import type { NextFunction, Request, Response } from "express";
import { getFranceConnectRedirectUrl } from "../../connectors/franceconnect";
import { csrfToken } from "../../middlewares/csrf-protection";

//

export async function getCertificationDirigeantController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    return res.render("user/certification-dirigeant", {
      csrfToken: csrfToken(req),
      pageTitle: "Certification dirigeant",
    });
  } catch (error) {
    next(error);
  }
}

export async function postCertificationDirigeantController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { nonce, state } = createOidcChecks();
    req.session.nonce = nonce;
    req.session.state = state;
    req.session.redirectTo = "/users/certification-dirigeant";
    const url = await getFranceConnectRedirectUrl(nonce, state);

    return res.redirect(url.toString());
  } catch (error) {
    next(error);
  }
}

export async function getCertificationDirigeantRepresentingController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userOrganizations = [
      {
        id: "1",
        siret: "12345678901234",
        cached_libelle: "Organisation 1",
        cached_adresse: "123 rue de la paix",
        cached_libelle_activite_principale: "Activité principale 1",
      },
    ];
    return res.render("user/select-organization", {
      csrfToken: csrfToken(req),
      illustration: "illu-password.svg",
      pageTitle: "Choisir une organisation",
      userOrganizations,
    });
  } catch (error) {
    next(error);
  }
}
