const { Expense } = require('../support/utils')

describe("Miscellanus Tests", () => {
  before(() => {
    cy.startUp()
    cy.fixture('expense').then(function(expenseData) {
      const expense = new Expense(expenseData)
      const paginationLimit = 20

      for(let i=0; i < paginationLimit; i++) {
        cy.addExpenseWithAPI(expense)
      }
    })
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('sessionid')
  })

  it("check multiple expenses added", function() {
    //cy.get("tbody > tr")
  })

  it("should show pagination buttons when more than 10 expenses are added", function() {
    cy.get('[data-test=pagination]').should('be.visible')
    cy.get('[data-test=previous-button]').should('be.visible')
      .and('have.class', 'disabled')
    cy.get('[data-test=page-link-1]').should('be.visible')
      .and('have.class', 'active')
    cy.get('[data-test=page-link-2]').should('be.visible')
      .and('not.have.class', 'active')
    cy.get('[data-test=next-button]').should('be.visible')
      .and('not.have.class', 'disabled')
  })

  it("should show second page of pagination", function() {
    cy.get('[data-test=page-link-2]').click()
    cy.get('[data-test=previous-button]').should('be.visible')
      .and('not.have.class', 'disabled')
    cy.get('[data-test=page-link-1]').should('be.visible')
      .and('not.have.class', 'active')
    cy.get('[data-test=page-link-2]').should('be.visible')
      .and('have.class', 'active')
    cy.get('[data-test=next-button]').should('be.visible')
      .and('have.class', 'disabled')
  })

  it("should show charts once expenses have been added", function() {
    cy.get('#totalExpensesLineChart').should('be.visible')
    cy.visit('/charts/')
    cy.get('#monthlyExpensesBarChart').should('be.visible')
    cy.get('#weeklyExpensesBarChart').should('be.visible')
    cy.get('#totalExpensesPieChart').should('be.visible')
    cy.get('#monthlyExpensesPieChart').should('be.visible')
  })

  it.skip("+Add Expense button should have focus", function() {
    cy.visit('/')
    cy.get('[data-test=add-expense]').should('be.visible')
      .and('have.focus')
  })
})