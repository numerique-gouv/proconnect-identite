//

import {
  AppleEuropeInc,
  CommunautéDeCommunes,
  ExpertiseRurale,
  JeanMichelEntrepreneur,
  JeanPierreEntrepreneur,
  MegevandSas,
  NintendoOfEuropeSe,
  OctoTechnology,
  StihleFreres,
} from "#src/testing/seed/siret";
import type { InseeAddressEstablishment } from "#src/types";
import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { formatAddress } from "./adresse-establishment.js";

suite(formatAddress.name, () => {
  const cases: [InseeAddressEstablishment, string][] = [
    [
      AppleEuropeInc.adresse,
      "100 west ten wilmington delawa, 99404, ETATS-UNIS",
    ],
    [
      CommunautéDeCommunes.adresse,
      "3 rue maison de vatimesnil, 27150 Etrepagny",
    ],
    [ExpertiseRurale.adresse, "le haut jumel, 62990 Beaurainville"],
    [JeanMichelEntrepreneur.adresse, "44049 Le croisic"],
    [JeanPierreEntrepreneur.adresse, "06155 Vallauris"],
    [
      MegevandSas.adresse,
      "Za immeuble l'octogone, 226 rue du jura, 74160 Neydens",
    ],
    [
      NintendoOfEuropeSe.adresse,
      "goldsteinstrasse 235, 60528 frankfurt am main, 99109, ALLEMAGNE",
    ],
    [OctoTechnology.adresse, "34 avenue de l'opera, 75002 Paris"],
    [StihleFreres.adresse, "7 rue de la fecht, 68230 Wihr-au-val"],
  ];

  for (const [inseeAddress, address] of cases) {
    test(address, () => {
      const formattedAddress = formatAddress(inseeAddress);
      assert.equal(formattedAddress, address);
    });
  }
});
