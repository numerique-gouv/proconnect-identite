import type { InseeSiretEstablishment } from "#src/types";

export default {
  siret: "21920023500014",
  siege_social: true,
  etat_administratif: "A",
  date_fermeture: null,
  enseigne: "MAIRIE",
  activite_principale: {
    code: "84.11Z",
    nomenclature: "NAFRev2",
    libelle: "Administration publique générale",
  },
  tranche_effectif_salarie: {
    de: 1000,
    a: 1999,
    code: "42",
    date_reference: "2022",
    intitule: "1 000 à 1 999 salariés",
  },
  diffusable_commercialement: true,
  status_diffusion: "diffusible",
  date_creation: 415321200,
  unite_legale: {
    siren: "219200235",
    rna: null,
    siret_siege_social: "21920023500014",
    type: "personne_morale",
    personne_morale_attributs: {
      raison_sociale: "COMMUNE DE CLAMART",
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
    categorie_entreprise: "ETI",
    status_diffusion: "diffusible",
    diffusable_commercialement: true,
    forme_juridique: {
      code: "7210",
      libelle: "Commune et commune nouvelle",
    },
    activite_principale: {
      code: "84.11Z",
      nomenclature: "NAFRev2",
      libelle: "Administration publique générale",
    },
    tranche_effectif_salarie: {
      de: 1000,
      a: 1999,
      code: "42",
      date_reference: "2022",
      intitule: "1 000 à 1 999 salariés",
    },
    economie_sociale_et_solidaire: false,
    date_creation: 315529200,
    etat_administratif: "A",
  },
  adresse: {
    status_diffusion: "diffusible",
    complement_adresse: null,
    numero_voie: "1",
    indice_repetition_voie: null,
    type_voie: "PLACE",
    libelle_voie: "MAURICE GUNSBOURG",
    code_postal: "92140",
    libelle_commune: "CLAMART",
    libelle_commune_etranger: null,
    distribution_speciale: null,
    code_commune: "92023",
    code_cedex: null,
    libelle_cedex: null,
    code_pays_etranger: null,
    libelle_pays_etranger: null,
    acheminement_postal: {
      l1: "COMMUNE DE CLAMART",
      l2: "",
      l3: "",
      l4: "1 PLACE MAURICE GUNSBOURG",
      l5: "",
      l6: "92140 CLAMART",
      l7: "FRANCE",
    },
  },
} as InseeSiretEstablishment;
