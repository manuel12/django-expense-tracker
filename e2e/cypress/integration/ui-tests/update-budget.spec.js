/// <reference types="cypress" />

const { Budget } = require("../../support/utils");

const budgetData = require("../../fixtures/budget.json");
const newBudgetData = require("../../fixtures/new-budget.json");

describe("Update budget Tests", () => {
  const ctx = {};

  beforeEach(() => {
    // Delete budget to start clean.
    cy.loginAndCleanUp(ctx);

    ctx.budget = new Budget(budgetData);
    cy.createBudgetWithAPI(ctx.budget, ctx);

    ctx.newBudget = new Budget(newBudgetData);

    cy.visit("/");
    cy.get("[data-test=update-budget]").click();
    cy.url().then((url) => {
      ctx.updateBudgetPageUrl = url;
    });
  });

  it("should update a budget's amount", () => {
    cy.updateBudgetField(ctx.newBudget.amount);

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("[data-test=monthly-budget]")
      .should("be.visible")
      .and("contain", `Monthly budget:`)
      .and("contain", `€ ${ctx.newBudget.getDecimalAmount()}`);

    cy.get("[data-test=update-budget]").should("be.visible");
    cy.get("[data-test=delete-budget]").should("be.visible");
  });

  it("should NOT allow to update a budget while leaving a amount field empty", () => {
    ctx.newBudget.amount = "   ";
    cy.updateBudgetField(ctx.newBudget.amount);

    cy.url().should("eq", ctx.updateBudgetPageUrl);
    cy.get("[data-test=update-budget-form]").should("be.visible");
  });

  it("should NOT allow to update a budget with amount bigger than 999,999", () => {
    ctx.newBudget.amount = 1000000;
    cy.updateBudgetField(ctx.newBudget.amount);

    cy.url().should("eq", ctx.updateBudgetPageUrl);
    cy.get("[data-test=container]")
      .should("be.visible")
      .and("contain", "Ensure that budget amount is not higher than 999,999.");
  });

  it("should display the old budget amount when user clicks the cancel button on the form", () => {
    cy.updateBudgetField(ctx.newBudget.amount, false);

    cy.get("[data-test=update-budget-cancel]").click();

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("[data-test=monthly-budget]")
      .should("contain", `Monthly budget:`)
      .and("contain", `€ ${ctx.budget.getDecimalAmount()}`);

    cy.get("[data-test=update-budget]").should("be.visible");
    cy.get("[data-test=delete-budget]").should("be.visible");
  });
});
