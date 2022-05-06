/// <reference types="cypress" />

describe("Logout Tests", () => {
  before(function () {
    cy.loginAndCleanUp();
  });

  it("should log out the user", () => {
    cy.get("[data-test=logout-link]").click();

    cy.url().should("include", "accounts/login/?next=/");
    cy.get("[data-test=user-greet]")
      .should("be.visible")
      .and("contain", "You are not logged in")
      .and("contain", "Sign Up")
      .and("contain", "Log In");
  });
});
