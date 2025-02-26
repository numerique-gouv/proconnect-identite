//

import type { paths } from "#openapi";

//

export type InseeAddressEstablishment = InseeSiretEstablishment["adresse"];
export type InseeMainActivityEstablishment =
  InseeSiretEstablishment["activite_principale"];
export type InseeSirenEstablishment =
  paths["/v3/insee/sirene/unites_legales/{siren}"]["get"]["responses"][200]["content"]["application/json"]["data"];
export type InseeSiretEstablishment =
  paths["/v3/insee/sirene/etablissements/{siret}"]["get"]["responses"][200]["content"]["application/json"]["data"];
export type TrancheEffectifs =
  InseeSiretEstablishment["tranche_effectif_salarie"]["code"];
