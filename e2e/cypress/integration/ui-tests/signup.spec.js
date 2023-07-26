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

  it("should show show homepage after signup and login", () => {
    cy.contains("Sign Up").click();
    cy.get("[data-test=username]")
      .type(username)
      .get("[data-test=password]")
      .type(password)
      .get("[data-test=password-confirmation]")
      .type(password);
    cy.get("[data-test=signup]").click();

    cy.get("[data-test=success-message]").should(
      "contain",
      `User registered successfully!`
    );

    cy.url().should("contain", "/accounts/login");

    cy.loginWithUI(username, password);
  });

  it("should NOT allow you to signup without submitting username, password and password confirmation", () => {
    cy.contains("Sign Up").click();

    cy.get("[data-test=signup]").click();

    cy.get("[data-test=user-greet]")
      .should("be.visible")
      .and("contain", "You are not logged in")
      .and("contain", "Sign Up")
      .and("contain", "Log In");

    cy.get("[data-test=container]").should(
      "contain",
      "You need to provide username, password and password confirmation."
    );
  });

  it("should NOT allow you to signup with the exisiting username", () => {
    // Create testuser
    cy.contains("Sign Up").click();
    cy.get("[data-test=username]")
      .type(username)
      .get("[data-test=password]")
      .type(password)
      .get("[data-test=password-confirmation]")
      .type(password);
    cy.get("[data-test=signup]").click();

    cy.get("[data-test=success-message]").should(
      "contain",
      `User registered successfully!`
    );

    cy.url().should("contain", "/accounts/login");

    // Try to create same testuser again.
    cy.contains("Sign Up").click();
    cy.get("[data-test=username]")
      .type(username)
      .get("[data-test=password]")
      .type(password)
      .get("[data-test=password-confirmation]")
      .type(password);
    cy.get("[data-test=signup]").click();

    cy.url().should("contain", "/accounts/signup");
    cy.get("form").should("be.visible");
    cy.get("[data-test=user-taken-error-label]").should(
      "contain",
      "The username you entered has already been taken! Please try another username."
    );
  });

  it("should NOT allow signup with incorrect password confirmation", () => {
    const password = "fakepass123";
    const password2 = "fake123pass";

    cy.contains("Sign Up").click();
    cy.get("[data-test=username]")
      .type(username)
      .get("[data-test=password]")
      .type(password)
      .get("[data-test=password-confirmation]")
      .type(password2);
    cy.get("[data-test=signup]").click();

    cy.url().should("contain", "/accounts/signup");
    cy.get("form").should("be.visible");
    cy.get("[data-test=passwords-no-match-error-label]").should(
      "contain",
      "The two password fields didn’t match!"
    );
  });

  afterEach(() => {
    cy.logout();
    cy.deleteTestuser(username);
  });
});
