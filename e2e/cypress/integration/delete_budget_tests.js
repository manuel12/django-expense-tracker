const { Expense, Budget } = require('../support/utils')

describe("Delete budget Tests", () => {
  before(() => {
    cy.startUp()
    cy.fixture('expense').then(function(expenseData) {
      const expense = new Expense(expenseData)
      cy.addExpenseWithAPI(expense)
      cy.wrap(expense).as('expense')
    })
  })

  beforeEach(() => {
    cy.deleteElementIfExists('budget')
    
    cy.fixture('budget').then(function(budgetData) {
      const budget = new Budget(budgetData)
      cy.addBudgetWithAPI(budget)
      cy.wrap(budget).as('budget')
    })    
    Cypress.Cookies.preserveOnce('sessionid')
  })

  it("should delete a budget.", function() {
    cy.deleteBudget()

    cy.url().should('eq', Cypress.config().baseUrl)
    cy.get('[data-test=budget-container]').should('not.exist')
    cy.get('[data-test=budget-progress-bar]').should('not.exist')
    cy.get('[data-test=update-budget]').should('not.exist')
    cy.get('[data-test=delete-budget]').should('not.exist')
  })

  it("should show the old budget amount when user clicks the cancel button on the form.", function() {
    cy.get('[data-test=delete-budget]').click()
    cy.get('[data-test=delete-budget-cancel]').click()

    cy.url().should('eq', Cypress.config().baseUrl)
    cy.get('[data-test=total-budget]')
      .should('contain', `Monthly budget:`) 
      .and('contain', `€ ${this.budget.getDecimalAmount()}`)

    cy.get('[data-test=update-budget]').should('be.visible')
    cy.get('[data-test=delete-budget]').should('be.visible')
  })
})