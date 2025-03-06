//

import { emptyDatabase, migrate, pg } from "#testing";
import assert from "node:assert/strict";
import { before, beforeEach, suite, test } from "node:test";
import { findByEmailFactory } from "./find-by-email.js";

//

const findByEmail = findByEmailFactory({ pg: pg as any });

suite("findByEmailFactory", () => {
  before(migrate);
  beforeEach(emptyDatabase);

  test("should find a user by email", async () => {
    await pg.sql`
      INSERT INTO users
        (id, email, created_at, updated_at, given_name, family_name, phone_number, job)
      VALUES
        (1, 'lion.eljonson@darkangels.world', '4444-04-04', '4444-04-04', 'lion', 'el''jonson', 'i', 'primarque'),
        (2, 'perturabo@ironwarriors.world', '4444-04-04', '4444-04-04', 'lion', 'el''jonson', 'iv', 'primarque')
      ;
    `;

    const user = await findByEmail("lion.eljonson@darkangels.world");

    assert.deepEqual(user, {
      created_at: new Date("4444-04-04"),
      current_challenge: null,
      email: "lion.eljonson@darkangels.world",
      email_verified: false,
      email_verified_at: null,
      encrypted_password: "",
      encrypted_totp_key: null,
      family_name: "el'jonson",
      force_2fa: false,
      given_name: "lion",
      id: 1,
      job: "primarque",
      last_sign_in_at: null,
      magic_link_sent_at: null,
      magic_link_token: null,
      needs_inclusionconnect_onboarding_help: false,
      needs_inclusionconnect_welcome_page: false,
      phone_number: "i",
      reset_password_sent_at: null,
      reset_password_token: null,
      sign_in_count: 0,
      totp_key_verified_at: null,
      updated_at: new Date("4444-04-04"),
      verify_email_sent_at: null,
      verify_email_token: null,
    });
  });

  test("❎ fail to find the God-Emperor of Mankind", async () => {
    const user = await findByEmail("the God-Emperor of Mankind");

    assert.deepEqual(user, undefined);
  });
});
