/// <reference types="cypress" />

const testuserData = require("../../fixtures/testuser.json");

describe("Logout Tests", () => {
  const apiUrl = "http://localhost:8000/api";

  before(() => {
    // Hardcode a real login.
    cy.loginWithUI(testuserData.username, testuserData.password);
  });

  it("should log out the user", () => {
    cy.get("[data-test=logout-link]").click();

    cy.get("[data-test=user-greet]")
      .should("be.visible")
      .and("contain", "You are not logged in")
      .and("contain", "Sign Up")
      .and("contain", "Log In");
  });
});
