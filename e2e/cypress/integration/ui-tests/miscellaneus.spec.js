/// <reference types="cypress" />

const { Expense } = require("../../support/utils");

const expenseData = require("../../fixtures/expense.json");

describe("Miscellaneus Tests", () => {
  const ctx = {};
  const paginationLimit = 10;

  before(() => {
    cy.loginAndCleanUp(ctx);

    const expense = new Expense(expenseData);
    const numExpensesToAdd = paginationLimit + 5;

    for (let i = 0; i < numExpensesToAdd; i++) {
      cy.createExpenseWithAPI(expense, ctx);
    }
    cy.visit("/");
  });

  it("should display multiple expenses", () => {
    cy.get("tbody > tr").its("length").should("eq", paginationLimit);
  });

  it("should display pagination buttons when more than 10 expenses are added", () => {
    cy.get("[data-test=pagination]").should("be.visible");
    cy.get("[data-test=previous-button]")
      .should("be.visible")
      .and("have.class", "disabled");

    cy.get("[data-test=page-link-1]")
      .should("be.visible")
      .and("have.class", "active");

    cy.get("[data-test=page-link-2]")
      .should("be.visible")
      .and("not.have.class", "active");

    cy.get("[data-test=next-button]")
      .should("be.visible")
      .and("not.have.class", "disabled");
  });

  it("should display second page of pagination", () => {
    cy.get("[data-test=page-link-2]").click();
    cy.get("[data-test=previous-button]")
      .should("be.visible")
      .and("not.have.class", "disabled");
    cy.get("[data-test=page-link-1]")
      .should("be.visible")
      .and("not.have.class", "active");
    cy.get("[data-test=page-link-2]")
      .should("be.visible")
      .and("have.class", "active");
    cy.get("[data-test=next-button]")
      .should("be.visible")
      .and("have.class", "disabled");
  });

  it.skip("should display charts once expenses have been added", () => {
    cy.get("[data-test=total-expenses-line-chart]").should("be.visible");
    cy.visit("/charts/");
    cy.get("[data-test=monthly-expenses-bar-chart]").should("be.visible");
    cy.get("[data-test=weekly-expenses-bar-chart]").should("be.visible");
    cy.get("[data-test=total-expenses-pie-chart]").should("be.visible");
    cy.get("[data-test=monthly-expenses-pie-chart]").should("be.visible");
  });

  it.skip("+Create Expense button should have focus", () => {
    cy.visit("/");
    cy.get("[data-test=create-expense]").should("be.visible").and("have.focus");
  });
});
