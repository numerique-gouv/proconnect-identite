//

import { UserVerificationTypeSchema } from "#src/types";
import { emptyDatabase, migrate, pg } from "#testing";
import { expect } from "chai";
import { before, describe, it } from "mocha";
import { upsetUserVerificationLinkFactory } from "./upset-user-verification-link.js";

//

const upsetUserVerificationLink = upsetUserVerificationLinkFactory({
  pg: pg as any,
});

describe("upsetUserVerificationLink", () => {
  before(migrate);
  beforeEach(emptyDatabase);

  it("should insert a user Verification link", async () => {
    await pg.sql`
      INSERT INTO users
        (id, email, created_at, updated_at, given_name, family_name, phone_number, job)
      VALUES
        (1, 'lion.eljonson@darkangels.world', '4444-04-04', '4444-04-04', 'lion', 'el''jonson', 'i', 'primarque'),
        (2, 'perturabo@ironwarriors.world', '4444-04-04', '4444-04-04', 'lion', 'el''jonson', 'iv', 'primarque')
      ;
    `;

    const user = await upsetUserVerificationLink({
      created_at: new Date("4444-04-01"),
      updated_at: new Date("4444-04-02"),
      verified_at: new Date("4444-04-04"),
      user_id: 1,
      verification_type: UserVerificationTypeSchema.Enum.franceconnect,
    });

    expect(user.created_at).to.deep.equal(new Date("4444-04-01"));
    expect(user.updated_at).to.not.deep.equal(new Date("4444-04-02"));
    expect(user.user_id).to.deep.equal(1);
    expect(user.verification_type).to.equal(
      UserVerificationTypeSchema.Enum.franceconnect,
    );
    expect(user.verified_at).to.deep.equal(new Date("4444-04-04"));
  });

  it("should update a user Verification link", async () => {
    await pg.sql`
      INSERT INTO users
        (id, email, created_at, updated_at, given_name, family_name, phone_number, job)
      VALUES
        (1, 'lion.eljonson@darkangels.world', '4444-04-04', '4444-04-04', 'lion', 'el''jonson', 'i', 'primarque'),
        (2, 'perturabo@ironwarriors.world', '4444-04-04', '4444-04-04', 'lion', 'el''jonson', 'iv', 'primarque')
      ;
    `;
    await pg.sql`
      INSERT INTO users_verification
        (user_id, created_at, updated_at)
      VALUES
        (1, '4444-04-01', '4444-04-02')
      ;
    `;

    const user = await upsetUserVerificationLink({
      verified_at: new Date("4444-04-04"),
      verification_type: UserVerificationTypeSchema.Enum.franceconnect,
      user_id: 1,
    });

    expect(user.created_at).to.deep.equal(new Date("4444-04-01"));
    expect(user.updated_at).to.not.deep.equal(new Date("4444-04-02"));
    expect(user.user_id).to.deep.equal(1);
    expect(user.verified_at).to.deep.equal(new Date("4444-04-04"));
  });

  it("❎ fail to update an unknown user", async () => {
    await expect(
      upsetUserVerificationLink({
        user_id: 42,
        verification_type: UserVerificationTypeSchema.Enum.franceconnect,
      }),
    ).to.rejectedWith(
      `insert or update on table "users_verification" violates foreign key constraint "users_verification_user_id_fkey"`,
    );
  });
});
