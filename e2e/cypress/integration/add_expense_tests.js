const { Expense, getRandomObjKey } = require('../support/utils')
const fieldsToEmpty = ['amount', 'content', 'category', 'source', 'date']

describe("Add expense Tests", () => {
  before(() => {
    cy.startUp()
  })

  beforeEach(() => {
    cy.fixture('expense').then(function(expenseData) {
      const expense = new Expense(expenseData)
      cy.wrap(expense).as('expense')
    })

    cy.visit('/')
    cy.get('[data-test=add-expense]').click()
    cy.url().as('addExpensePageURL')
    
    Cypress.Cookies.preserveOnce('sessionid')
  })
  
  it("should add an expense.", function() {
    cy.addExpense(this.expense)
    
    cy.url().should('eq', Cypress.config().baseUrl)
    cy.get('#expense-table > table > tbody > tr:nth-child(1)').should('be.visible')
      .and('contain', `€ ${this.expense.amount}`)
      .and('contain', this.expense.content)
      .and('contain', this.expense.category)
      .and('contain', this.expense.source)
      .and('contain', this.expense.getDateOnExpenseTableFormat())
  })

  it("should not allow to add an expense while leaving 'amount' field at 0.", function() {
    this.expense.amount = 0
    cy.addExpense(this.expense)
    
    cy.url().should('eq', this.addExpensePageURL)      
    cy.get('[data-test=expense-form]').should('be.visible')
      .and('contain', 'Ensure this value is greater than or equal to 0.01.')
  })

  fieldsToEmpty.forEach((fieldToEmpty) => {
    it(`should not allow to add an expense while leaving ${fieldToEmpty} field empty.`, function() {
      cy.addExpense(this.expense, false)
  
      if(fieldToEmpty == 'category')
        cy.get(`#id_${fieldToEmpty}`).select("---------")
      else
        cy.get(`#id_${fieldToEmpty}`).clear()
      cy.get('[data-test=add-expense-save]').click()
  
      cy.url().should('eq', this.addExpensePageURL)      
      cy.get('[data-test=expense-form]').should('be.visible')
    })
  })

  it("should not allow to add an expense with a huge 'amount' number.", function() {
    this.expense.amount = 99999999999 
    cy.addExpense(this.expense)

    cy.url().should('eq', this.addExpensePageURL)      
    cy.get('[data-test=expense-form]').should('be.visible')
      .and('contain', 'Ensure that there are no more than 10 digits in total.')

  })

  it("should not allow to add an expense with an incorrect format date.", function() {  
    this.expense.date = '20201210 1200pm' 
    cy.addExpense(this.expense)

    cy.url().should('eq', this.addExpensePageURL)      
    cy.get('[data-test=expense-form]').should('be.visible')
      .and('contain', 'Enter a valid date/time.')

  })
})