//

import type {
  EntrepriseApiTrackingParams,
  EntrepriseOpenApiClient,
} from "#src/client";
import { EntrepriseApiError } from "#src/types";

//

export function findBySirenFactory(
  client: EntrepriseOpenApiClient,
  trackingParams: EntrepriseApiTrackingParams,
) {
  return async function findBySiren(siren: string) {
    const { data, error } = await client.GET(
      "/v3/insee/sirene/unites_legales/{siren}/siege_social",
      {
        params: {
          path: {
            siren,
          },
          query: trackingParams,
        },
      },
    );

    if (error) throw new EntrepriseApiError(error);

    const { data: establishment } = data;
    return establishment;
  };
}

export type FindBySirenHandler = ReturnType<typeof findBySirenFactory>;
