/// <reference types="cypress" />

describe("Error page Tests", () => {
  // Only run this test when expense_tracker > settings.py > DEBUG = False.
  it("should display 404 page", () => {
    cy.visit("/non-existing-page/");
    cy.get("h2")
      .should("be.visible")
      .and("contain", "The item you requested is not available. (404)");
  });

  it("should display 'no access' message when  trying to access home or charts while logged out", () => {
    cy.visit("/");
    cy.get("h2").contains(
      "You do not have access to this page, please log in first."
    );

    cy.visit("charts/");
    cy.get("h2").contains(
      "You do not have access to this page, please log in first."
    );
  });
});
