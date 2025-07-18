//

describe("sign-in with email verification renewal", () => {
  it("should seed the database once", function () {
    cy.seed();
  });

  it("should sign-in with email verification needed", () => {
    cy.visit("/users/start-sign-in");

    cy.login("lion.eljonson@darkangels.world");

    cy.contains("Confirmer votre adresse");

    cy.contains(
      "Information : pour garantir la sécurité de votre compte, nous avons besoin d’authentifier votre navigateur.",
    );

    cy.contains(
      "Un code de vérification a été envoyé à lion.eljonson@darkangels.world",
    );

    cy.verifyEmail();

    cy.contains("Votre compte ProConnect");
  });

  it("should be able to sign in after re-sending code", () => {
    cy.visit("/users/start-sign-in");

    cy.login("rogal.dorn@imperialfists.world");

    cy.get('[action="/users/send-email-verification"]')
      .contains("Recevoir un nouvel email")
      .should("be.disabled");

    // Wait for countdown to last
    cy.wait(10 * 1000);

    cy.maildevDeleteAllMessages();

    cy.get('[action="/users/send-email-verification"]')
      .contains("Recevoir un nouvel email")
      .click();

    cy.contains(
      "Un nouveau code de vérification a été envoyé à rogal.dorn@imperialfists.world",
    );

    cy.verifyEmail();

    cy.contains("Votre compte ProConnect");
  });
});
