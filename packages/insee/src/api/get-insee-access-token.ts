//

import type { paths } from "#openapi/auth";
import { InseeApiAuthError } from "#src/types";
import createClient, { type ClientOptions } from "openapi-fetch";

//

export function getInseeAccessTokenFactory(
  body: {
    client_id: string;
    client_secret: string;
    grant_type: "password";
    username: string;
    password: string;
  },
  options: ClientOptions = {},
) {
  return async function getInseeAccessToken() {
    const client = createClient<paths>({
      baseUrl: options.baseUrl ?? "https://auth.insee.net/auth",
      ...options,
    });

    const { data, error } = await client.POST(
      "/realms/apim-gravitee/protocol/openid-connect/token",
      {
        body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    if (error) {
      throw new InseeApiAuthError(error);
    }

    return data.access_token;
  };
}

export type GetInseeAccessTokenHandler = ReturnType<
  typeof getInseeAccessTokenFactory
>;
