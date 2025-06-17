//

import type { paths } from "#openapi";
import createClient, { type ClientOptions } from "openapi-fetch";

//

/**
 * Create an INSEE OpenAPI client
 * @see https://help.opendatasoft.com/apis/ods-explore-v2/explore_v2.1.html
 * @param options - the client options
 * @note `options.baseUrl` is "https://api.insee.fr/api-sirene/prive/3.11" by default
 * @returns the client
 */
export function createInseeOpenApiClient(
  token: string,
  options: ClientOptions = {},
) {
  return createClient<paths>({
    baseUrl: options.baseUrl ?? "https://api.insee.fr/api-sirene/prive/3.11",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });
}

export type InseeOpenApiClient = ReturnType<typeof createInseeOpenApiClient>;
