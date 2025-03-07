//

import { emptyDatabase, migrate, pg } from "#testing";
import assert from "node:assert/strict";
import { before, beforeEach, suite, test } from "node:test";
import { findByUserIdFactory } from "./find-by-user-id.js";

//

const findByUserId = findByUserIdFactory({ pg: pg as any });

suite("findByUserIdFactory", () => {
  before(migrate);
  beforeEach(emptyDatabase);
  beforeEach(seed);

  test("should return empty array when user has no organizations", async () => {
    const organizations = await findByUserId(42);
    assert.deepEqual(organizations, []);
  });

  test("should return single organization when user has one organization", async () => {
    const organizations = await findByUserId(6);

    assert.deepEqual(organizations, [
      {
        cached_activite_principale: null,
        cached_adresse: null,
        cached_categorie_juridique: null,
        cached_code_officiel_geographique: null,
        cached_code_postal: null,
        cached_enseigne: null,
        cached_est_active: null,
        cached_est_diffusible: null,
        cached_etat_administratif: null,
        cached_libelle_activite_principale: null,
        cached_libelle_categorie_juridique: null,
        cached_libelle_tranche_effectif: null,
        cached_libelle: "👨‍🚀",
        cached_nom_complet: "Ultramarines Chapter",
        cached_statut_diffusion: null,
        cached_tranche_effectifs_unite_legale: null,
        cached_tranche_effectifs: null,
        created_at: new Date("2023-05-05"),
        has_been_greeted: true,
        id: 5,
        is_executive: true,
        is_external: false,
        needs_official_contact_email_verification: false,
        official_contact_email_verification_sent_at: new Date("2023-07-06"),
        official_contact_email_verification_token: "imperial_token_6",
        organization_info_fetched_at: null,
        siret: "40000000000005",
        updated_at: new Date("2024-06-20"),
        verification_type: "imperial",
      },
    ]);
  });

  test("should return multiple organizations when user has multiple organizations", async () => {
    const organizations = await findByUserId(1);

    assert.deepEqual(organizations, [
      {
        cached_activite_principale: null,
        cached_adresse: null,
        cached_categorie_juridique: null,
        cached_code_officiel_geographique: null,
        cached_code_postal: null,
        cached_enseigne: null,
        cached_est_active: null,
        cached_est_diffusible: null,
        cached_etat_administratif: null,
        cached_libelle: "⚰️",
        cached_libelle_activite_principale: null,
        cached_libelle_categorie_juridique: null,
        cached_libelle_tranche_effectif: null,
        cached_nom_complet: "Sautekh Dynasty",
        cached_statut_diffusion: null,
        cached_tranche_effectifs: null,
        cached_tranche_effectifs_unite_legale: null,
        created_at: new Date("2023-01-15"),
        has_been_greeted: true,
        id: 1,
        is_executive: true,
        is_external: false,
        needs_official_contact_email_verification: false,
        official_contact_email_verification_sent_at: new Date("2023-01-26"),
        official_contact_email_verification_token: "necron_token_1",
        organization_info_fetched_at: null,
        siret: "40000000000001",
        updated_at: new Date("2024-02-10"),
        verification_type: "necron",
      },
      {
        cached_activite_principale: null,
        cached_adresse: null,
        cached_categorie_juridique: null,
        cached_code_officiel_geographique: null,
        cached_code_postal: null,
        cached_enseigne: null,
        cached_est_active: null,
        cached_est_diffusible: null,
        cached_etat_administratif: null,
        cached_libelle: "🤖",
        cached_libelle_activite_principale: null,
        cached_libelle_categorie_juridique: null,
        cached_libelle_tranche_effectif: null,
        cached_nom_complet: "Szarekhan Dynasty",
        cached_statut_diffusion: null,
        cached_tranche_effectifs: null,
        cached_tranche_effectifs_unite_legale: null,
        created_at: new Date("2023-03-25"),
        has_been_greeted: false,
        id: 3,
        is_executive: false,
        is_external: true,
        needs_official_contact_email_verification: true,
        official_contact_email_verification_sent_at: new Date("2023-04-02"),
        official_contact_email_verification_token: "alliance_token_1",
        organization_info_fetched_at: null,
        siret: "40000000000003",
        updated_at: new Date("2024-04-12"),
        verification_type: "alliance",
      },
    ]);
  });
});

//

async function seed() {
  await pg.sql`
    INSERT INTO organizations
      (id, cached_libelle, cached_nom_complet, siret, created_at, updated_at)
    VALUES
      (1, '⚰️', 'Sautekh Dynasty', '40000000000001', '2023-01-15', '2024-02-10'),
      (2, '💀', 'Nihilakh Dynasty', '40000000000002', '2023-02-20', '2024-03-05'),
      (3, '🤖', 'Szarekhan Dynasty', '40000000000003', '2023-03-25', '2024-04-12'),
      (4, '🔥', 'Adeptus Mechanicus', '40000000000004', '2023-04-10', '2024-05-15'),
      (5, '👨‍🚀', 'Ultramarines Chapter', '40000000000005', '2023-05-05', '2024-06-20'),
      (6, '👹', 'Death Guard', '40000000000006', '2023-06-15', '2024-07-25')
    ;
  `;

  await pg.sql`
    INSERT INTO users
      (id, email, created_at, updated_at, given_name, family_name, phone_number, job)
    VALUES
      (1, 'imotekh@sautekh.necron', '2023-01-20', '2024-02-15', 'Imotekh', 'The Stormlord', '00000000001', 'Phaeron'),
      (2, 'trazyn@nihilakh.necron', '2023-02-25', '2024-03-10', 'Trazyn', 'The Infinite', '00000000002', 'Archaeologist'),
      (6, 'marneus.calgar@ultramar.imperium', '2023-06-20', '2024-07-30', 'Marneus', 'Calgar', '00000000006', 'Chapter Master'),
      (7, 'mortarion@plague.chaos', '2023-07-25', '2024-08-05', 'Mortarion', 'Primarch', '00000000007', 'Daemon Primarch')
    ;
  `;

  await pg.sql`
    INSERT INTO users_organizations
      (user_id, organization_id, created_at, updated_at, is_external, verification_type, needs_official_contact_email_verification, official_contact_email_verification_token, official_contact_email_verification_sent_at, is_executive, has_been_greeted)
    VALUES
      (1, 1, '2023-01-25', '2024-02-20', false, 'necron', false, 'necron_token_1', '2023-01-26', true, true),
      (1, 3, '2023-04-01', '2024-05-05', true, 'alliance', true, 'alliance_token_1', '2023-04-02', false, false),
      (2, 2, '2023-03-01', '2024-04-01', false, 'necron', false, 'necron_token_2', '2023-03-02', true, true),
      (6, 5, '2023-07-05', '2024-08-15', false, 'imperial', false, 'imperial_token_6', '2023-07-06', true, true)
    ;
  `;
}
