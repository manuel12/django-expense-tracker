/// <reference types="cypress" />

const faker = require("faker");
const username = faker.name.firstName();
const password = faker.internet.password();

describe("Signup Tests", () => {
  before(() => {
    cy.visit("/");
    cy.logout();
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("should show show homepage after signup", () => {
    cy.contains("Sign Up").click();
    cy.get("#id_username")
      .type(username)
      .get("#id_password1")
      .type(password)
      .get("#id_password2")
      .type(password);
    cy.get("[data-test=signup]").click();

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("[data-test=user-greet]")
      .should("be.visible")
      .and("contain", `Hi ${username}`)
      .and("contain", "Log Out");
  });

  it("should NOT allow you to signup with the exisiting username", () => {
    // Create testuser
    cy.contains("Sign Up").click();
    cy.get("#id_username")
      .type(username)
      .get("#id_password1")
      .type(password)
      .get("#id_password2")
      .type(password);
    cy.get("[data-test=signup]").click();

    cy.logout();

    // Try to create same testuser again.
    cy.contains("Sign Up").click();
    cy.get("#id_username")
      .type(username)
      .get("#id_password1")
      .type(password)
      .get("#id_password2")
      .type(password);
    cy.get("[data-test=signup]").click();

    cy.url().should("contain", "/accounts/signup/");
    cy.get("form").should("be.visible");
    cy.get("[data-test=error-labels]").should(
      "contain",
      "The username you entered has already been taken! Please try another username."
    );
  });

  it("should NOT allow signup with incorrect password confirmation", () => {
    const password = "fakepass123";
    const password2 = "fake123pass";

    cy.contains("Sign Up").click();
    cy.get("#id_username")
      .type(username)
      .get("#id_password1")
      .type(password)
      .get("#id_password2")
      .type(password2);
    cy.get("[data-test=signup]").click();

    cy.url().should("contain", "/accounts/signup/");
    cy.get("form").should("be.visible");
    cy.get("[data-test=error-labels]").should(
      "contain",
      "The two password fields didn’t match!"
    );
  });

  afterEach(() => {
    cy.logout();
    cy.deleteTestuser(username);
  });
});
