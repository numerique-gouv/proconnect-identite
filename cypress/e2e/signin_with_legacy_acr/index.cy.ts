describe("sign-in with a client not requiring any acr", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4000");
    cy.setRequestedAcrs();
  });

  it.only("should sign-in an return the ACR_VALUE_FOR_IAL1_AAL1 acr value", function () {
    cy.get("button#custom-connection").click({ force: true });

    cy.login("ial1-aal1@yopmail.com");

    cy.contains('"acr": "eidas1"');
  });

  it("should sign-in an return the ACR_VALUE_FOR_IAL2_AAL1 acr value", function () {
    cy.get("button#custom-connection").click({ force: true });

    cy.login("ial2-aal1@yopmail.com");

    cy.contains('"acr": "eidas1"');
  });

  it("should sign-in an return the ACR_VALUE_FOR_IAL1_AAL1 acr value", function () {
    cy.get("button#custom-connection").click({ force: true });

    cy.login("ial1-aal2@yopmail.com");

    cy.contains('"acr": "eidas1"');
  });

  it("should sign-in an return the ACR_VALUE_FOR_IAL2_AAL1 acr value", function () {
    cy.get("button#custom-connection").click({ force: true });

    cy.login("ial2-aal2@yopmail.com");

    cy.contains('"acr": "eidas1"');
  });
});

describe("sign-in with a client requiring certification dirigeant identity", () => {
  it("should sign-in an return the ACR_VALUE_FOR_CERTIFICATION_DIRIGEANT acr value", function () {
    cy.visit("http://localhost:4000");
    cy.setRequestedAcrs([
      "https://proconnect.gouv.fr/assurance/certification-dirigeant",
    ]);

    cy.get("button#custom-connection").click({ force: true });

    cy.login("certification-dirigeant@yopmail.com");

    cy.getByLabel(
      "Commune de lamalou-les-bains - Mairie (choisir cette organisation)",
    ).click();

    cy.contains(
      '"acr": "https://proconnect.gouv.fr/assurance/certification-dirigeant"',
    );
  });
});

describe("sign-in with a client requiring certification dirigeant and consistency-checked", () => {
  it("should return an error with no self asserted acr", function () {
    cy.visit("http://localhost:4000");
    cy.setRequestedAcrs([
      "https://proconnect.gouv.fr/assurance/certification-dirigeant",
      "https://proconnect.gouv.fr/assurance/consistency-checked",
      "https://proconnect.gouv.fr/assurance/consistency-checked-2fa",
    ]);

    cy.get("button#custom-connection").click({ force: true });

    cy.login("ial1-aal1@yopmail.com");

    cy.contains("Erreur access_denied");

    cy.contains("none of the requested ACRs could be obtained");

    cy.get("a.fr-btn").contains("Continuer").click();

    cy.contains(
      "AuthorizationResponseError: authorization response from the server is an error",
    );
  });
});

describe("sign-in with a client requiring eidas1", () => {
  it("should return an error with no self asserted acr", function () {
    cy.visit("http://localhost:4000");
    cy.setRequestedAcrs(["eidas1"]);

    cy.get("button#custom-connection").click({ force: true });

    cy.login("ial1-aal1@yopmail.com");

    cy.contains('"acr": "eidas1"');
  });
});
