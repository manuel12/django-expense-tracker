/// <reference types="cypress" />

const { Expense } = require("../../support/utils");

const expenseData = require("../../fixtures/expense.json");

describe("Delete expense Tests", () => {
  const ctx = {};

  beforeEach(() => {
    cy.loginAndCleanUp(ctx);

    ctx.expense = new Expense(expenseData);
    cy.createExpenseWithAPI(ctx.expense, ctx);
  });

  it("should delete an expense", () => {
    cy.get("[data-test^=delete-expense]").first().click();
    cy.get("[data-test=delete-expense-yes]").first().click();

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("[data-test=container]").should(
      "contain",
      "No expenses for this user."
    );
    cy.get("[data-test=expense-table]").should("not.exist");
  });

  it("should still display the expense table with expense data after user clicks the cancel button on the form", () => {
    cy.get("[data-test^=delete-expense]").first().click();
    cy.get("[data-test=delete-expense-no]").click();

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("[data-test=expense-table]")
      .should("be.visible")
      .and("contain", ctx.expense.amount)
      .and("contain", ctx.expense.content)
      .and("contain", ctx.expense.category)
      .and("contain", ctx.expense.source)
      .and("contain", ctx.expense.date);
  });
});
