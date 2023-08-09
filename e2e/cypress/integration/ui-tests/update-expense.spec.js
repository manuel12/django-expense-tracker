/// <reference types="cypress" />

const { Expense } = require("../../support/utils");
const fieldsToUpdate = ["amount", "content", "category", "source", "date"];

const expenseData = require("../../fixtures/expense.json");
const newExpenseData = require("../../fixtures/new-expense.json");

describe("Update expense Tests", () => {
  const ctx = {};

  beforeEach(() => {
    // Delete expense to start clean.
    cy.loginAndCleanUp(ctx);

    ctx.expense = new Expense(expenseData);
    cy.createExpenseWithAPI(ctx.expense, ctx);

    ctx.newExpense = new Expense(newExpenseData);

    cy.visit("/");
    cy.get("[data-test^=update-expense]").first().click();
    cy.url().then((url) => {
      ctx.updateExpensePageUrl = url;
    });
  });

  fieldsToUpdate.forEach((fieldToUpdate) => {
    it(`should update the ${fieldToUpdate} of an expense`, () => {
      let textToCheck;

      if (fieldToUpdate === "date") {
        textToCheck = ctx.newExpense.date;
      } else if (fieldsToUpdate === "amount") {
        textToCheck = `€ ${ctx.newExpense[fieldToUpdate]}`;
      } else {
        textToCheck = ctx.newExpense[fieldToUpdate];
      }

      cy.updateExpenseField(fieldToUpdate, ctx.newExpense[fieldToUpdate]);

      cy.url().should("eq", Cypress.config().baseUrl);
      cy.get("#expense-table > table > tbody > tr:nth-child(1)")
        .should("be.visible")
        .and("contain", textToCheck);
    });
  });

  it("should NOT allow to update an expense while leaving 'amount' field at 0", () => {
    cy.updateExpenseField("amount", 0);

    cy.url().should("eq", ctx.updateExpensePageUrl);
    cy.get("[data-test=container]")
      .should("be.visible")
      .and("contain", "Ensure this value is greater than or equal to 0.01.");
  });

  fieldsToUpdate.forEach((fieldToUpdate) => {
    it(`should NOT allow to update an expense while leaving ${fieldToUpdate} field empty`, () => {
      fieldToUpdate === "category"
        ? cy.updateExpenseField(fieldToUpdate, "---------")
        : cy.updateExpenseField(fieldToUpdate, " ");
      cy.url().should("eq", ctx.updateExpensePageUrl);
      cy.get("[data-test=update-expense-form]").should("be.visible");
    });
  });

  it("should NOT allow to update an expense with amount bigger than 9,999,999,999", () => {
    cy.updateExpenseField("amount", 99999999999);

    cy.url().should("eq", ctx.updateExpensePageUrl);
    cy.get("[data-test=container]")
      .should("be.visible")
      .and(
        "contain",
        "Ensure that expense amount is not bigger than 9,999,999,999."
      );
  });

  it("should NOT allow to update an expense with an incorrect format date", () => {
    cy.updateExpenseField("date", "2020/12/12 1230pm");

    cy.url().should("eq", ctx.updateExpensePageUrl);
    cy.get("[data-test=container]")
      .should("be.visible")
      .and("contain", "Enter a valid date/time.");
  });

  it("should display the old expense amount when user clicks the cancel button on the form", () => {
    cy.updateExpenseField("amount", 10000, false);

    cy.get("[data-test=update-expense-cancel]").click();

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("#expense-table > table > tbody > tr:nth-child(1)")
      .should("be.visible")
      .and("contain", ctx.expense.amount);
  });
});
