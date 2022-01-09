const faker = require("faker");
const username = faker.name.firstName();
const password = faker.internet.password();

describe("Signup Tests", () => {
  before(() => {
    cy.logout();
  })
  beforeEach(() => {
    cy.visit("/");
    cy.fixture("testuser").as("testuser");
  });

  it("should show show homepage after signup", function () {
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

  it("should NOT allow you to signup with the same username and password", function () {
    cy.contains("Sign Up").click();
    cy.get("#id_username")
      .type(username)
      .get("#id_password1")
      .type(password)
      .get("#id_password2")
      .type(password);
    cy.get("[data-test=signup]").click();

    cy.url().should("eq", Cypress.config().signupUrl);
    cy.get("form").should("be.visible");
  });
});
