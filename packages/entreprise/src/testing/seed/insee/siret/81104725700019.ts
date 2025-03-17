import type { InseeSiretEstablishment } from "#src/types";

export default {
  siret: "81104725700019",
  siege_social: true,
  etat_administratif: "A",
  date_fermeture: null,
  enseigne: null,
  activite_principale: {
    code: "01.13Z",
    nomenclature: "NAFRev2",
    libelle: "Culture de légumes, de melons, de racines et de tubercules",
  },
  tranche_effectif_salarie: {
    de: 1,
    a: 2,
    code: "01",
    date_reference: "2022",
    intitule: "1 ou 2 salariés",
  },
  diffusable_commercialement: true,
  status_diffusion: "diffusible",
  date_creation: 1428357600,
  unite_legale: {
    siren: "811047257",
    rna: null,
    siret_siege_social: "81104725700019",
    type: "personne_morale",
    personne_morale_attributs: {
      raison_sociale: "EXPERTISE RURALE",
      sigle: null,
    },
    personne_physique_attributs: {
      pseudonyme: null,
      prenom_usuel: null,
      prenom_1: null,
      prenom_2: null,
      prenom_3: null,
      prenom_4: null,
      nom_usage: null,
      nom_naissance: null,
      sexe: null,
    },
    categorie_entreprise: null,
    status_diffusion: "diffusible",
    diffusable_commercialement: true,
    forme_juridique: {
      code: "5499",
      libelle: "Société à responsabilité limitée (sans autre indication)",
    },
    activite_principale: {
      code: "01.13Z",
      nomenclature: "NAFRev2",
      libelle: "Culture de légumes, de melons, de racines et de tubercules",
    },
    tranche_effectif_salarie: {
      de: 1,
      a: 2,
      code: "01",
      date_reference: "2022",
      intitule: "1 ou 2 salariés",
    },
    economie_sociale_et_solidaire: false,
    date_creation: 1428357600,
    etat_administratif: "A",
  },
  adresse: {
    status_diffusion: "diffusible",
    complement_adresse: null,
    // NOTE(douglasduteil): numero_voie can be null in real life
    // Yes, sadly, the openapi is lying to use here :sad:
    numero_voie: null as any,
    indice_repetition_voie: null,
    type_voie: null,
    libelle_voie: "LE HAUT JUMEL",
    code_postal: "62990",
    libelle_commune: "BEAURAINVILLE",
    libelle_commune_etranger: null,
    distribution_speciale: null,
    code_commune: "62100",
    code_cedex: null,
    libelle_cedex: null,
    code_pays_etranger: null,
    libelle_pays_etranger: null,
    acheminement_postal: {
      l1: "EXPERTISE RURALE",
      l2: "",
      l3: "",
      l4: "LE HAUT JUMEL",
      l5: "",
      l6: "62990 BEAURAINVILLE",
      l7: "FRANCE",
    },
  },
} as InseeSiretEstablishment;
