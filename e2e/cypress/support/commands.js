const { makeAPICall, Expense } = require('../support/utils')

Cypress.Commands.add('startUp', () => {
  cy.clearCookie('sessionid')
  cy.loginWithAPI()
  cy.deleteElementIfExists('budget')
  cy.deleteElementIfExists('expense')
})

Cypress.Commands.add('login', (user, password) => {
  cy.visit('/') 
  cy.get('#id_username').type(user)
    .get('#id_password').type(password)
    .get('[data-test=login]').click()
})


Cypress.Commands.add('loginWithAPI', () => {
  cy.visit('/') 
  cy.fixture('user').then(user => {
    makeAPICall('login', {
      username: user.username, 
      password: user.password
    })
  })
})

Cypress.Commands.add('addExpense',  (data, submit=true) => {
  cy.visit('/')

  cy.get('[data-test=add-expense]').click()
  cy.get('#id_amount').clear().type(data.amount)
    .get('#id_content').type(data.content)
    .get('#id_category').select(data.category)
    .get('#id_source').type(data.source)

  if(data.date)
    cy.get('#id_date').clear().type(data.date)

  if(submit)
    cy.get('[data-test=add-expense-save]').click()
})

Cypress.Commands.add('addExpenseWithAPI', (data) => {
  cy.visit('add/')
  makeAPICall('addExpense', data)
})

Cypress.Commands.add('updateExpenseField', (field, value, submit=true) => {
  if(field == 'category')
    cy.get(`#id_${field}`).select(value)
  else
    cy.get(`#id_${field}`).clear().type(value)
  
  if(submit)
    cy.get('[data-test=update-expense-save]').click()
})

Cypress.Commands.add('deleteExpensesWithAPI', (href) => {
  cy.visit(href)
  makeAPICall('deleteExpenses', {href: href})
})


Cypress.Commands.add('addBudget', (data, submit=true) => {
  cy.visit('/')

  cy.get('[data-test=add-budget]').click()
  cy.get('#id_amount').clear().type(data.amount)

  if(submit)
    cy.get('[data-test=add-budget-save]').click()
})

Cypress.Commands.add('addBudgetWithAPI', (data) => {
  cy.visit('/add-budget/')
  makeAPICall('addBudget', data)
})

Cypress.Commands.add('updateBudgetField', (value, submit=true) => {
  cy.get(`#id_amount`).clear().type(value)

  if(submit)
    cy.get('[data-test=update-budget-save]').click()
})

Cypress.Commands.add('deleteBudget', () => {
  cy.get('[data-test=delete-budget]').click()
  cy.get('[data-test=delete-budget-yes]').click()
})

Cypress.Commands.add('deleteBudgetWithAPI', () => {
  cy.visit('/delete-budget/')
  makeAPICall('deleteBudget')
})

Cypress.Commands.add('deleteElementIfExists', (elementType) => {
  const elementToDelete = elementType == 'expense' ? 
    '[data-test^=delete-expense-]' : '[data-test=delete-budget]'

  cy.visit('/')
  cy.get('body').then((body) => {
    if(body.find(elementToDelete).length > 0) {
      
      cy.log(`element has [${body.find(elementToDelete).length}] ocurrences`)

      cy.get(elementToDelete).invoke('attr', 'href').then((href) => {
        elementType == 'expense' ? 
          cy.deleteExpensesWithAPI(href) : cy.deleteBudgetWithAPI()
        cy.deleteElementIfExists(elementType)
      })
    }
  })
})