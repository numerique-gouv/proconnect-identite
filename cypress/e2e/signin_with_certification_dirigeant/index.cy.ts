describe("sign-in with a client requiring certification dirigeant", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4000");
    cy.setRequestedAcrs([
      "https://proconnect.gouv.fr/assurance/certification-dirigeant",
    ]);
    cy.get("button#custom-connection").click({ force: true });
  });

  it("should sign-in as the executive of an organization", function () {
    cy.login("certified-franceconnected+dirigeant@yopmail.com");

    cy.title().should("include", "Certification dirigeant -");
    cy.contains("Certifier votre statut");
    cy.contains("Continuer").click();

    cy.title().should("include", "Choisir une organisation -");
    cy.getDescribed("Commune de lamalou-les-bains - Mairie").within(() => {
      cy.contains("certifié");
    });

    cy.getByLabel(
      "Commune de lamalou-les-bains - Mairie (choisir cette organisation)",
    ).click();

    cy.contains('"job": "Certified Single Dirigeant",');

    cy.contains(
      '"acr": "https://proconnect.gouv.fr/assurance/certification-dirigeant"',
    );
  });

  it("should refuse FranceConnect-ed empolyee", function () {
    cy.login("franceconnected+employee@yopmail.com");

    cy.title().should("include", "Certification dirigeant -");
    cy.contains("Certifier votre statut");
    cy.contains("Continuer").click();

    cy.getDescribed("Commune de lamalou-les-bains - Mairie").within(() => {
      cy.contains("certifié").should("not.exist");
    });

    cy.getByLabel(
      "Commune de lamalou-les-bains - Mairie (choisir cette organisation)",
    ).click();

    cy.contains("Erreur access_denied");
  });

  it("should be unable to certify a random pair", function () {
    cy.login("franceconnected+dirigeant@unipersonnelle.com");

    cy.title().should("include", "Certification dirigeant -");
    cy.contains("Certifier votre statut");
    cy.contains("Continuer").click();

    cy.contains("SIRET de l’organisation que vous représentez").click();
    cy.focused().clear().type("82869625200018");

    cy.getByLabel(
      "Organisation correspondante au SIRET donné : Douglas Duteil",
    ).click();

    cy.title().should("include", "Certification impossible -");
    cy.contains("Nous n’arrivons pas à certifier votre compte.");
  });

  it.only("should recognize Douglas Duteil as an executive of ONEDOES.DRAW.DOUBLEACE", function () {
    cy.login("douglasduteil@mail.com");

    cy.title().should("include", "Certification dirigeant -");
    cy.contains("Certifier votre statut");
    cy.contains("Continuer").click();

    cy.contains("SIRET de l’organisation que vous représentez").click();
    cy.focused().clear().type("82869625200018");

    cy.getByLabel(
      "Organisation correspondante au SIRET donné : Douglas Duteil",
    ).click();

    cy.title().should("include", "Certification -");
    cy.contains("Nous n’arrivons pas à certifier votre compte.");
  });

  it("should sign-in without org selection when having only one organization certified", function () {
    cy.login("bi+certification-dirigeant@yopmail.com");

    cy.contains("Authentifier votre statut");
    cy.contains("S’identifier avec").click();

    cy.origin("https://fcp.integ01.dev-franceconnect.fr", () => {
      cy.contains("Démonstration eIDAS faible").click();
    });
    cy.origin("https://fip1-low.integ01.fcp.fournisseur-d-identite.fr", () => {
      cy.contains("Mot de passe").click();
      cy.focused().type("123");
      cy.contains("Valider").click();
    });
    cy.origin("https://fcp.integ01.dev-franceconnect.fr", () => {
      cy.contains("Continuer sur FSPublic").click();
    });

    cy.contains('"job": "Single Dirigeant",');

    cy.contains(
      '"acr": "https://proconnect.gouv.fr/assurance/certification-dirigeant"',
    );
  });

  it("should sign-in with org selection when having two organization", function () {
    cy.login("bi+certification-dirigeant@yopmail.com");

    cy.get(".fr-grid-row .fr-col-12:first-child .fr-tile__link").contains(
      "Commune de lamalou-les-bains - Mairie",
    );
    cy.get(".fr-grid-row .fr-col-12:last-child .fr-tile__link").contains(
      "Commune de clamart - Mairie",
    );

    cy.get(".fr-grid-row .fr-col-12:last-child .fr-tile__link").click();

    cy.contains("standard-client");
    cy.contains("unused2@yopmail.com");
    cy.contains("Commune de clamart - Mairie");

    // then it should prompt for organization
    cy.get("button#select-organization").click();
    cy.contains("Votre organisation de rattachement");
    cy.get(".fr-grid-row .fr-col-12:first-child .fr-tile__link").click();

    cy.contains("standard-client");
    cy.contains("Commune de lamalou-les-bains - Mairie");
  });

  it("should not prompt for password if a session is already opened", () => {
    cy.visit("/");
    cy.login("single+certification-dirigeant@yopmail.com");

    cy.visit("http://localhost:4000");
    cy.get("button.proconnect-button").click();

    cy.contains("standard-client");
    cy.contains("single+certification-dirigeant@yopmail.com");
  });
});
