/// <reference types="cypress" />

const { Budget } = require("../../support/utils");

const budgetData = require("../../fixtures/budget.json");

describe("Create budget Tests", () => {
  const ctx = {};

  beforeEach(() => {
    // Delete budget to start clean.
    cy.loginAndCleanUp(ctx);
    ctx.budget = new Budget(budgetData);

    cy.get("[data-test=create-budget]").click();
    cy.url().then((url) => {
      ctx.createBudgetPageUrl = url;
    });
    cy.visit("/");
  });

  it("should create a budget", () => {
    cy.createBudgetWithUI(ctx.budget);

    cy.url().should("eq", Cypress.config().baseUrl);

    cy.get("[data-test=monthly-budget]")
      .should("be.visible")
      .and("contain", "Monthly budget:")
      .and("contain", `€ ${ctx.budget.getDecimalAmount()}`);

    cy.get("[data-test=update-budget]").should("be.visible");
    cy.get("[data-test=delete-budget]").should("be.visible");
  });

  it("should NOT allow to create a budget while leaving a 'amount' field on 0", () => {
    ctx.budget.amount = 0;
    cy.createBudgetWithUI(ctx.budget);

    cy.url().should("eq", ctx.createBudgetPageUrl);
    cy.get("[data-test=create-budget-form]").should("be.visible");
  });

  it("should NOT allow to create a budget while leaving a required field empty", () => {
    ctx.budget.amount = "   ";
    cy.createBudgetWithUI(ctx.budget);

    cy.url().should("eq", ctx.createBudgetPageUrl);
    cy.get("[data-test=create-budget-form]").should("be.visible");
  });

  it("should NOT allow to create a budget higher than 999,999", () => {
    ctx.budget.amount = 1000000;
    cy.createBudgetWithUI(ctx.budget);

    cy.url().should("eq", ctx.createBudgetPageUrl);
    cy.get("[data-test=container]")
      .should("be.visible")
      .and("contain", "Ensure that budget amount is not higher than 999,999.");
  });

  it("should remove 'Create Budget' button once the user has added a budget", () => {
    ctx.budget.amount = 30;
    cy.createBudgetWithUI(ctx.budget);

    cy.get("[data-test=create-budget]").should("not.exist");
  });
});
