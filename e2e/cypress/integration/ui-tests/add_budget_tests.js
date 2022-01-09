const { Expense, Budget } = require("../../support/utils");

describe("Add budget Tests", () => {
  before(() => {
    cy.loginAndCleanUp();
  });

  beforeEach(() => {
    // Delete budget to start clean.
    cy.deleteElementIfExists("budget");

    cy.fixture("budget").then(function (budgetData) {
      const budget = new Budget(budgetData);
      cy.wrap(budget).as("budget");
    });
    cy.get("[data-test=add-budget]").click();
    cy.url().as("addBudgetPageURL");

    Cypress.Cookies.preserveOnce("sessionid");
  });

  it("should add a budget.", function () {
    cy.addBudget(this.budget);

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("[data-test=monthly-budget]")
      .should("be.visible")
      .and("contain", "Monthly budget:")
      .and("contain", `€ ${this.budget.getDecimalAmount()}`);

    cy.get("[data-test=update-budget]").should("be.visible");
    cy.get("[data-test=delete-budget]").should("be.visible");
  });

  it("should not allow to add a budget while leaving a 'amount' field on 0.", function () {
    this.budget.amount = 0;
    cy.addBudget(this.budget);

    cy.url().should("eq", this.addBudgetPageURL);
    cy.get("[data-test=add-budget-form]").should("be.visible");
  });

  it("should not allow to add a budget while leaving a required field empty.", function () {
    this.budget.amount = "   ";
    cy.addBudget(this.budget);

    cy.url().should("eq", this.addBudgetPageURL);
    cy.get("[data-test=add-budget-form]").should("be.visible");
  });

  it("should not allow to add a budget with more than 5 digits in 'amount' number.", function () {
    this.budget.amount = 999999;
    cy.addBudget(this.budget);

    cy.url().should("eq", this.addBudgetPageURL);
    cy.get("[data-test=add-budget-form]")
      .should("be.visible")
      .and("contain", "Ensure that there are no more than 5 digits in total.");
  });

  it("should remove 'Add Budget' button once the user has added a budget.", function () {
    this.budget.amount = 30;
    cy.addBudget(this.budget);

    cy.get("[data-test=add-budget]").should("not.exist");
  });
});
