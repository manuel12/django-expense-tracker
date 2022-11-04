/// <reference types="cypress" />

describe("Error page Tests", () => {
  before(() => {
    cy.loginAndCleanUp();
  });

  it("should display 404 page", () => {
    const url = "/non-existing-page/";
    cy.request({
      url,
      failOnStatusCode: false,
    });

    cy.visit(url, { failOnStatusCode: false });
    cy.get("h2")
      .should("be.visible")
      .and("contain", "The item you requested is not available. (404)");
  });
});
