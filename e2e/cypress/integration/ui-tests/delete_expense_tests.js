const { Expense } = require('../../support/utils')

describe("Delete expense Tests", () => {
  before(() => {
    cy.loginAndCleanUp()
  })
  beforeEach(() => {
    cy.fixture('expense').then(function(expenseData) {
      const expense = new Expense(expenseData)
      cy.addExpenseWithAPI(expense)
      cy.wrap(expense).as('expense')
    })
    
    Cypress.Cookies.preserveOnce('sessionid')
  })

  it("should delete an expense.", function() {
    cy.get('[data-test^=delete-expense]').first().click()
    cy.get('[data-test=delete-expense-yes]').first().click()
    
    cy.url().should('eq', Cypress.config().baseUrl)
    cy.get('[data-test=container]').should('contain', 'No expenses for this user.')
    cy.get('[data-test=expense-table]').should('not.exist')
  })

  it("should still display the expense table with expense data after user clicks the cancel button on the form.", function() {
    cy.get('[data-test^=delete-expense]').first().click()
    cy.get('[data-test=delete-expense-no]').click()

    cy.url().should('eq', Cypress.config().baseUrl)
    cy.get('[data-test=expense-table]').should('be.visible')
      .and('contain', this.expense.amount)
      .and('contain', this.expense.content)
      .and('contain', this.expense.category)
      .and('contain', this.expense.source)
      .and('contain', this.expense.date)
  })
})