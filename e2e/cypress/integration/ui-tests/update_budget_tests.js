const { Expense, Budget } = require("../../support/utils");

describe("Update budget Tests", function () {
  before(() => {
    cy.loginAndCleanUp();
  });

  beforeEach(() => {
    // Delete budget to start clean.
    cy.deleteElementIfExists("budget");

    cy.fixture("budget").then(function (budgetData) {
      const budget = new Budget(budgetData);
      cy.addBudgetWithAPI(budget);
      cy.wrap(budget).as("budget");
    });
    cy.fixture("newBudget").then(function (budgetData) {
      const newBudget = new Budget(budgetData);
      cy.wrap(newBudget).as("newBudget");
    });
    cy.get("[data-test=update-budget]").click();
    cy.url().as("updateBudgetPageURL");

    Cypress.Cookies.preserveOnce("sessionid");
  });

  it("should update a budget's amount", function () {
    cy.updateBudgetField(this.newBudget.amount);

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("[data-test=monthly-budget]")
      .should("be.visible")
      .and("contain", `Monthly budget:`)
      .and("contain", `€ ${this.newBudget.getDecimalAmount()}`);

    cy.get("[data-test=update-budget]").should("be.visible");
    cy.get("[data-test=delete-budget]").should("be.visible");
  });

  it("should not allow to update a budget while leaving a amount field empty", function () {
    this.newBudget.amount = "   ";
    cy.updateBudgetField(this.newBudget.amount);

    cy.url().should("eq", this.updateBudgetPageURL);
    cy.get("[data-test=update-budget-form]").should("be.visible");
  });

  it("should not allow to update a budget with more than 5 digits in 'amount' number", function () {
    this.newBudget.amount = 999999;
    cy.updateBudgetField(this.newBudget.amount);

    cy.url().should("eq", this.updateBudgetPageURL);
    cy.get("[data-test=update-budget-form]")
      .should("be.visible")
      .and("contain", "Ensure that there are no more than 5 digits in total.");
  });

  it("should display the old budget amount when user clicks the cancel button on the form", function () {
    cy.updateBudgetField(this.newBudget.amount, false);

    cy.get("[data-test=update-budget-cancel]").click();

    cy.url().should("eq", Cypress.config().baseUrl);
    cy.get("[data-test=monthly-budget]")
      .should("contain", `Monthly budget:`)
      .and("contain", `€ ${this.budget.getDecimalAmount()}`);

    cy.get("[data-test=update-budget]").should("be.visible");
    cy.get("[data-test=delete-budget]").should("be.visible");
  });
});
