/// <reference types="cypress" />

const { Budget } = require("../../support/utils");

const budgetData = require("../../fixtures/budget.json");
const newBudgetData = require("../../fixtures/new-budget.json");

describe("Update budget Tests", () => {
  const ctx = {};

  before(() => {
    cy.loginAndCleanUp();
  });

  beforeEach(() => {
    // Delete budget to start clean.
    cy.deleteElementIfExists("budget");

    const budget = new Budget(budgetData);
    cy.createBudgetWithAPI(budget);
    ctx.budget = budget;

    const newBudget = new Budget(newBudgetData);
    ctx.newBudget = newBudget;

    cy.get("[data-test=update-budget]").click();
    cy.url().then((url) => {
        ctx.updateBudgetPageUrl = url;
    })

    Cypress.Cookies.preserveOnce("sessionid");
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

  it("should NOT allow to update a budget with more than 5 digits in 'amount' number", () => {
    ctx.newBudget.amount = 999999;
    cy.updateBudgetField(ctx.newBudget.amount);

    cy.url().should("eq", ctx.updateBudgetPageUrl);
    cy.get("[data-test=update-budget-form]")
      .should("be.visible")
      .and("contain", "Ensure that there are no more than 5 digits in total.");
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
