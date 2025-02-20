//

import {
  AppleEuropeInc,
  JeanMichelEntrepreneur,
} from "@gouvfr-lasuite/proconnect.entreprise/testing/seed/siret";
import { describe } from "mocha";
import assert from "node:assert/strict";
import { fromSiret } from "./establishment.js";

describe(fromSiret.name, () => {
  it("AppleEuropeInc", () => {
    const organization = fromSiret(AppleEuropeInc);
    assert.deepEqual(organization, {
      activitePrincipale: "70.22Z",
      adresse: "100 west ten wilmington delawa, 99404, ETATS-UNIS",
      categorieJuridique: "3120",
      codeOfficielGeographique: "",
      codePostal: null,
      enseigne: "",
      estActive: false,
      estDiffusible: true,
      etatAdministratif: "A",
      libelle: "Apple europe inc.",
      libelleActivitePrincipale:
        "70.22Z - Conseil pour les affaires et autres conseils de gestion",
      libelleCategorieJuridique:
        "Société commerciale étrangère immatriculée au RCS",
      libelleTrancheEffectif: "",
      nomComplet: "Apple europe inc.",
      siret: "32122785200019",
      statutDiffusion: "diffusible",
      trancheEffectifs: null,
      trancheEffectifsUniteLegale: "31",
    });
  });

  it("JeanMichelEntrepreneur", () => {
    const organization = fromSiret(JeanMichelEntrepreneur);
    assert.deepEqual(organization, {
      activitePrincipale: "70.2A",
      adresse: "44049 Le croisic",
      categorieJuridique: "1000",
      codeOfficielGeographique: "44049",
      codePostal: "44049",
      enseigne: "",
      estActive: false,
      estDiffusible: false,
      etatAdministratif: "C",
      libelle: "Nom inconnu",
      libelleActivitePrincipale:
        "70.2A - ancienne révision NAF (NAF1993) non supportée",
      libelleCategorieJuridique: "Entrepreneur individuel",
      libelleTrancheEffectif: "",
      nomComplet: "Nom inconnu",
      siret: "00557246600026",
      statutDiffusion: "partiellement_diffusible",
      trancheEffectifs: null,
      trancheEffectifsUniteLegale: null,
    });
  });
});
