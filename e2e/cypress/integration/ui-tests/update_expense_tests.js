const { Expense } = require('../../support/utils')
const fieldsToUpdate = ['amount', 'content', 'category', 'source', 'date']

describe("Update expense Tests", function() {
  before(() => {
    cy.loginAndCleanUp()
  })
  
  beforeEach(() => {
    // Delete expense to start clean.
    cy.deleteElementIfExists('expense')

    cy.fixture('expense').then(expenseData => {
        const expense = new Expense(expenseData)
        cy.addExpenseWithAPI(expense)
        cy.wrap(expense).as('expense')
      })
      
    cy.fixture('newExpense').then(function(newExpenseData) {
      const newExpense = new Expense(newExpenseData)
      cy.wrap(newExpense).as('newExpense')
    })
      
    cy.get('[data-test^=update-expense]').first().click()
    cy.url().as('updateExpensePageURL')
    
    Cypress.Cookies.preserveOnce('sessionid')
  })

  fieldsToUpdate.forEach((fieldToUpdate) => {
    it(`should update the ${fieldToUpdate} of an expense`, function () {   
      let textToCheck

      if(fieldToUpdate === 'date') {
        textToCheck = this.newExpense.date
      } else if(fieldsToUpdate === 'amount') {
        textToCheck = `€ ${this.newExpense[fieldToUpdate]}`
      } else {
        textToCheck = this.newExpense[fieldToUpdate]
      }
      cy.updateExpenseField(fieldToUpdate, this.newExpense[fieldToUpdate])

      cy.url().should('eq', Cypress.config().baseUrl)
      cy.get('#expense-table > table > tbody > tr:nth-child(1)').should('be.visible')
        .and('contain', textToCheck)
    })
  })

  it("should not allow to update an expense while leaving 'amount' field at 0", function () {
    cy.updateExpenseField('amount', 0)
    
    cy.url().should('eq', this.updateExpensePageURL)
    cy.get('[data-test=update-expense-form]').should('be.visible')
      .and('contain', 'Ensure this value is greater than or equal to 0.01.')

  })

  fieldsToUpdate.forEach((fieldToUpdate) => {
    it(`should not allow to update an expense while leaving ${fieldToUpdate} field empty`, function() {
      fieldToUpdate === 'category' ? 
        cy.updateExpenseField(fieldToUpdate, "---------") : cy.updateExpenseField(fieldToUpdate, " ")
      cy.url().should('eq', this.updateExpensePageURL)
      cy.get('[data-test=update-expense-form]').should('be.visible')
    })
  })

  it("should not allow to update an expense with more than 10 digits in 'amount' number", function () {
    cy.updateExpenseField('amount', 99999999999)
    
    cy.url().should('eq', this.updateExpensePageURL)
    cy.get('[data-test=update-expense-form]').should('be.visible')
      .and('contain', 'Ensure that there are no more than 10 digits in total.')
  })

  it("should not allow to update an expense with an incorrect format date", function () {
    cy.updateExpenseField('date', "2020/12/12 1230pm")

    cy.url().should('eq', this.updateExpensePageURL)
    cy.get('[data-test=update-expense-form]').should('be.visible')
      .and('contain', 'Enter a valid date/time.')  
  })

  it("should display the old expense amount when user clicks the cancel button on the form", function () {
    cy.updateExpenseField('amount', 10000, false)

    cy.get('[data-test=update-expense-cancel]').click()

    cy.url().should('eq', Cypress.config().baseUrl)
    cy.get('#expense-table > table > tbody > tr:nth-child(1)').should('be.visible')
      .and('contain', this.expense.amount)
  })
})