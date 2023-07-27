/// <reference types="cypress" />

const { Expense, Budget } = require("../../support/utils");

const budgetData = require("../../fixtures/budget.json");

describe("Delete budget Tests", () => {
  const ctx = {};

  const setTokens = (tokens) => {
    ctx.access = tokens.access;
    ctx.refresh = tokens.refresh;
  };

  beforeEach(() => {
    // Delete budget to start clean.
    cy.loginAndCleanUp(setTokens);

    const budget = new Budget(budgetData);
    cy.createBudgetWithAPI(budget, ctx);
    ctx.budget = budget;
    cy.visit("/");
  });

  it("should delete a budget", () => {
    cy.deleteBudgetWithUI();

    cy.url().should("eq", Cypress.config().baseUrl);

    cy.get("[data-test=budget-container]").should("not.exist");
    cy.get("[data-test=budget-progress-bar]").should("not.exist");
    cy.get("[data-test=update-budget]").should("not.exist");
    cy.get("[data-test=delete-budget]").should("not.exist");
  });

  it("should display the old budget amount when user clicks the cancel button on the form", () => {
    cy.get("[data-test=delete-budget]").click();
    cy.get("[data-test=delete-budget-cancel]").click();

    cy.url().should("eq", Cypress.config().baseUrl);

    cy.get("[data-test=monthly-budget]")
      .should("contain", `Monthly budget:`)
      .and("contain", `€ ${ctx.budget.getDecimalAmount()}`);

    cy.get("[data-test=update-budget]").should("be.visible");
    cy.get("[data-test=delete-budget]").should("be.visible");
  });
});
