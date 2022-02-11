/// <reference types="cypress" />

describe("Visual tests - Homepage", () => {
    before(() => {
      cy.loginAndCleanUp();
      cy.addFixtureExpensesAndAlias();
      cy.addBudget({amount: 600})
      cy.get("body").should("be.visible").wait(1000);
    });
  
    beforeEach(function () {
      Cypress.Cookies.preserveOnce("sessionid");
    })
  
    it("should match Total Expenses container screenshot", () => {
      cy.get("#total-expenses-container")
        .should("be.visible")
        .matchImageSnapshot();
    });
  
    it("should match Budget container screenshot", () => {
      cy.get("#budget-container")
        .should("be.visible")
        .matchImageSnapshot();
    });
  
    it("should match Line Chart screenshot", () => {
      cy.get("#total-expenses-line-chart")
        .should("be.visible")
        .matchImageSnapshot();
    });
  
    it("should match Expense Table screenshot", () => {
      cy.get("#expense-table")
        .should("be.visible")
        .matchImageSnapshot();
    });
  });
  
  describe("Visual tests - Charts & Statistics", () => {
    before(() => {
      cy.loginAndCleanUp();
      cy.addFixtureExpensesAndAlias();
      cy.addBudget({amount: 600})
      cy.visit(Cypress.config().chartsUrl);
      cy.get("body").should("be.visible").wait(1000);
    });
  
    beforeEach(function () {
      Cypress.Cookies.preserveOnce("sessionid");
    });
  
    it("should match Expense Amounts by Month Bar Chart screenshot", () => {
      cy.get("[data-test=monthly-expenses-bar-chart]")
        .should("be.visible")
        .matchImageSnapshot();
    });
  
    it("should match Expense Amounts by Week Bar Chart screenshot", () => {
      cy.get("[data-test=weekly-expenses-bar-chart]")
        .should("be.visible")
        .matchImageSnapshot();
    });
  
    it("should match Total Expense Amounts Pie Chart screenshot", () => {
      cy.get("[data-test=total-expenses-pie-chart]")
        .should("be.visible")
        .matchImageSnapshot();
    });
  
    it("should match Monthly Expense Amounts Pie Chart screenshot", () => {
      cy.get("[data-test=monthly-expenses-pie-chart]")
        .should("be.visible")
        .matchImageSnapshot();
    });
  
    it("should match Statistics Table screenshot", () => {
      cy.get("#statistics-table")
        .should("be.visible")
        .matchImageSnapshot();
    });
  });
  