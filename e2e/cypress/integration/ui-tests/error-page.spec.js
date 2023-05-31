/// <reference types="cypress" />

describe("Error page Tests", () => {
  before(() => {
    cy.loginAndCleanUp();
  });

  // Only run this test when expense_tracker > settings.py > DEBUG = False.
  it.skip("should display 404 page", () => {
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
