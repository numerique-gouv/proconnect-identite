//

import { findMandatairesSociauxBySirenFactory } from "@gouvfr-lasuite/proconnect.entreprise/api/infogreffe";
import {
  findBySirenFactory,
  findBySiretFactory,
} from "@gouvfr-lasuite/proconnect.entreprise/api/insee";
import {
  createEntrepriseOpenApiClient,
  type EntrepriseOpenApiClient,
} from "@gouvfr-lasuite/proconnect.entreprise/client";
import { getOrganizationInfoFactory } from "@gouvfr-lasuite/proconnect.identite/managers/organization";
import * as InseeApi from "@gouvfr-lasuite/proconnect.insee/api";
import { createInseeSirenePrivateOpenApiClient } from "@gouvfr-lasuite/proconnect.insee/client";
import { TestingInseeApiRouter } from "@gouvfr-lasuite/proconnect.testing/api/routes/api.insee.fr";
import { TestingEntrepriseApiRouter } from "@gouvfr-lasuite/proconnect.testing/api/routes/entreprise.api.gouv.fr";
import {
  DEPLOY_ENV,
  ENTREPRISE_API_TOKEN,
  ENTREPRISE_API_TRACKING_CONTEXT,
  ENTREPRISE_API_TRACKING_RECIPIENT,
  ENTREPRISE_API_URL,
  HTTP_CLIENT_TIMEOUT,
  INSEE_API_CLIENT_ID,
  INSEE_API_CLIENT_SECRET,
  INSEE_API_PASSWORD,
  INSEE_API_URL,
  INSEE_API_USERNAME,
} from "../config/env";

//

export const entrepriseOpenApiClient: EntrepriseOpenApiClient =
  createEntrepriseOpenApiClient(ENTREPRISE_API_TOKEN, {
    baseUrl: ENTREPRISE_API_URL,
    fetch:
      DEPLOY_ENV === "localhost"
        ? (input: Request) =>
            Promise.resolve(TestingEntrepriseApiRouter.fetch(input))
        : undefined,
  });

export const EntrepriseApiInfogreffeRepository = {
  findMandatairesSociauxBySiren: findMandatairesSociauxBySirenFactory(
    entrepriseOpenApiClient,
    {
      context: ENTREPRISE_API_TRACKING_CONTEXT,
      object: "findMandatairesSociauxBySiren",
      recipient: ENTREPRISE_API_TRACKING_RECIPIENT,
    },
    () => ({
      signal: AbortSignal.timeout(HTTP_CLIENT_TIMEOUT),
    }),
  ),
};

export const EntrepriseApiInseeRepository = {
  findBySiren: findBySirenFactory(
    entrepriseOpenApiClient,
    {
      context: ENTREPRISE_API_TRACKING_CONTEXT,
      object: "findEstablishmentBySiren",
      recipient: ENTREPRISE_API_TRACKING_RECIPIENT,
    },
    () => ({
      signal: AbortSignal.timeout(HTTP_CLIENT_TIMEOUT),
    }),
  ),
  findBySiret: findBySiretFactory(
    entrepriseOpenApiClient,
    {
      context: ENTREPRISE_API_TRACKING_CONTEXT,
      object: "findEstablishmentBySiret",
      recipient: ENTREPRISE_API_TRACKING_RECIPIENT,
    },
    () => ({
      signal: AbortSignal.timeout(HTTP_CLIENT_TIMEOUT),
    }),
  ),
};

const getInseeAccessToken =
  DEPLOY_ENV === "localhost"
    ? () => Promise.resolve("__INSEE_ACCESS_TOKEN__")
    : InseeApi.getInseeAccessTokenFactory({
        client_id: INSEE_API_CLIENT_ID,
        client_secret: INSEE_API_CLIENT_SECRET,
        grant_type: "password",
        password: INSEE_API_PASSWORD,
        username: INSEE_API_USERNAME,
      });

async function getInseeOpenApiClient() {
  const token = await getInseeAccessToken();
  return createInseeSirenePrivateOpenApiClient(token, {
    baseUrl: INSEE_API_URL,
    fetch:
      DEPLOY_ENV === "localhost"
        ? (input: Request) =>
            Promise.resolve(TestingInseeApiRouter.fetch(input))
        : undefined,
  });
}

export const InseeApiRepository = {
  async findBySiret(siret: string) {
    const inseeOpenApiClient = await getInseeOpenApiClient();
    return InseeApi.findBySiretFactory(inseeOpenApiClient, () => ({
      signal: AbortSignal.timeout(HTTP_CLIENT_TIMEOUT),
    }))(siret);
  },
};

export const getOrganizationInfo = getOrganizationInfoFactory({
  findBySiren: EntrepriseApiInseeRepository.findBySiren,
  findBySiret: EntrepriseApiInseeRepository.findBySiret,
});
