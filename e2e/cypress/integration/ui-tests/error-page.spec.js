/// <reference types="cypress" />

describe("Error page Tests", () => {
  before(() => {
    cy.loginAndCleanUp();
  });

  it("should display 404 page", () => {
    const url = "/non-existing-page";
    cy.request({
      url,
      failOnStatusCode: false,
    })
      .its("status")
      .should("equal", 404);

    cy.visit(url, { failOnStatusCode: false });
    cy.contains("span", "404");
  });
});
