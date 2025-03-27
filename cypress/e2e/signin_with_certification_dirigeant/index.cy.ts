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

    //
    cy.title().should("equal", "standard-client - ProConnect");
    cy.contains('"job": "Certified Single Dirigeant",');
    cy.contains(
      '"acr": "https://proconnect.gouv.fr/assurance/certification-dirigeant"',
    );
  });

  it("should refuse FranceConnect-ed empolyee of known organization", function () {
    cy.login("franceconnected+employee@yopmail.com");

    cy.title().should("include", "Certification dirigeant -");
    cy.contains("Certifier votre statut");
    cy.contains("Continuer").click();

    cy.title().should("include", "Choisir une organisation -");
    cy.getDescribed("Clamart").within(() => {
      cy.contains("certifié").should("not.exist");
    });
    cy.getByLabel("Clamart (choisir cette organisation)").click();

    cy.title().should("include", "Certification impossible -");
    cy.contains("Nous n’arrivons pas à certifier votre compte.");
  });

  it("Jean is not certified for ONEDOES.DRAW.DOUBLEACE", function () {
    cy.login("franceconnected+dirigeant@unipersonnelle.com");

    cy.title().should("include", "Certification dirigeant -");
    cy.contains("Certifier votre statut");
    cy.contains("Continuer").click();

    cy.title().should("include", "Rejoindre une organisation -");
    cy.contains("SIRET de l’organisation que vous représentez").click();
    cy.focused().clear().type("82869625200018");
    cy.getByLabel(
      "Organisation correspondante au SIRET donné : Douglas Duteil",
    ).click();

    cy.title().should("include", "Certification impossible -");
    cy.contains("Nous n’arrivons pas à certifier votre compte.");
  });

  it("should re-FranceConnect expired Douglas Le Gris Duteil as an executive of ONEDOES.DRAW.DOUBLEACE", function () {
    cy.login("gray+douglasduteil@mail.com");

    cy.title().should("include", "Certification dirigeant -");
    cy.contains("Certifier votre statut");
    cy.getByLabel("S’identifier avec FranceConnect").click();

    cy.title().should("include", "🎭 FranceConnect 🎭");
    cy.get("input[name='family_name']").type("{selectAll}Duteil", {
      force: true,
    });
    cy.get("input[name='given_name']").type("{selectAll}Douglas Le Gris", {
      force: true,
    });
    cy.get("input[name='birthdate']").type("{selectAll}1980-06-01", {
      force: true,
    });
    cy.get("input[name='birthplace']").type("{selectAll}75000", {
      force: true,
    });
    cy.contains("Je suis Douglas Le Gris Duteil").click();

    cy.title().should("include", "Rejoindre une organisation");
    cy.contains("SIRET de l’organisation que vous représentez").click();
    cy.focused().clear().type("82869625200018");
    cy.getByLabel(
      "Organisation correspondante au SIRET donné : Douglas Duteil",
    ).click();

    cy.title().should("include", "Compte certifié -");
    cy.contains("Vous êtes bien certifié !");
    cy.contains("Douglas Le Gris");
    cy.contains("Duteil");
    cy.contains("gray+douglasduteil@mail.com");
    cy.contains("HyyyperProConnectDev4000");
    cy.contains("Douglas Duteil");
    cy.contains("Compte certifié");
    cy.contains("Continuer").click();

    cy.title().should("equal", "standard-client - ProConnect");
    cy.contains(
      '"acr": "https://proconnect.gouv.fr/assurance/certification-dirigeant"',
    );
  });

  it("should FranceConnect and match Douglas Le Rouge as an executive of ONEDOES.DRAW.DOUBLEACE", function () {
    cy.login("red+douglasduteil@mail.com");

    cy.title().should("include", "Certification dirigeant -");
    cy.contains("Certifier votre statut");
    cy.getByLabel("S’identifier avec FranceConnect").click();

    cy.title().should("include", "🎭 FranceConnect 🎭");
    cy.get("input[name='family_name']").type("{selectAll}Duteil", {
      force: true,
    });
    cy.get("input[name='given_name']").type("{selectAll}Douglas Le Rouge", {
      force: true,
    });
    cy.get("input[name='birthdate']").type("{selectAll}1990-06-01", {
      force: true,
    });
    cy.get("input[name='birthplace']").type("{selectAll}75000", {
      force: true,
    });
    cy.contains("Je suis Douglas Le Rouge Duteil").click();

    cy.title().should("include", "Rejoindre une organisation");
    cy.contains("SIRET de l’organisation que vous représentez").click();
    cy.focused().clear().type("82869625200018");
    cy.getByLabel(
      "Organisation correspondante au SIRET donné : Douglas Duteil",
    ).click();

    cy.title().should("include", "Compte certifié -");
    cy.contains("Vous êtes bien certifié !");
    cy.contains("Douglas Le Rouge");
    cy.contains("Duteil");
    cy.contains("red+douglasduteil@mail.com");
    cy.contains("HyyyperProConnectDev4000");
    cy.contains("Douglas Duteil");
    cy.contains("Compte certifié");
    cy.contains("Continuer").click();

    cy.title().should("equal", "standard-client - ProConnect");
    cy.contains(
      '"acr": "https://proconnect.gouv.fr/assurance/certification-dirigeant"',
    );
  });

  it("should try to re-certify expired certificated FranceConnect user", function () {
    cy.login("outdated-certified-franceconnected+dirigeant@unipersonnelle.com");

    cy.title().should("include", "Certification dirigeant -");
    cy.contains("Certifier votre statut");
    cy.contains("Continuer").click();

    cy.title().should("include", "Choisir une organisation -");
    cy.getByLabel("Clamart (choisir cette organisation)").click();

    cy.title().should("include", "Certification impossible -");
    cy.contains("Nous n’arrivons pas à certifier votre compte.");
  });
});

describe("connected user should go through the certification flow ", function () {
  it("with valid franceconnected user", function () {
    cy.visit("/");
    cy.login("certified-franceconnected+dirigeant@yopmail.com");

    cy.visit("http://localhost:4000");
    cy.title().should("equal", "standard-client - ProConnect");
    cy.setRequestedAcrs([
      "https://proconnect.gouv.fr/assurance/certification-dirigeant",
    ]);
    cy.get("button#custom-connection").click({ force: true });

    cy.title().should("include", "Certification dirigeant - ");
    cy.contains("Continuer").click();

    cy.title().should("include", "Choisir une organisation -");
    cy.getDescribed("Commune de lamalou-les-bains - Mairie").within(() => {
      cy.contains("certifié");
    });
  });

  it("should sign-in as the executive of an organization", function () {
    cy.visit("/");
    cy.login("outdated-franceconnected+dirigeant@yopmail.com");

    cy.visit("http://localhost:4000");
    cy.title().should("equal", "standard-client - ProConnect");
    cy.setRequestedAcrs([
      "https://proconnect.gouv.fr/assurance/certification-dirigeant",
    ]);
    cy.get("button#custom-connection").click({ force: true });

    cy.title().should("include", "Certification dirigeant - ");
    cy.contains("Certifier votre statut");
    cy.getByLabel("S’identifier avec FranceConnect");
  });
});
