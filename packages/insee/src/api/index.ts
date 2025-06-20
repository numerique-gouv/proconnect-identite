//

import type { FindBySiretHandler } from "./find-by-siret.js";
import type { GetInseeAccessTokenHandler } from "./get-insee-access-token.js";

//

export interface InseeApiRepository {
  getInseeAccessToken: GetInseeAccessTokenHandler;
  findBySiret: FindBySiretHandler;
}
