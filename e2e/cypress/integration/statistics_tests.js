const utils = require('../support/utils')
const { Expense, ExpenseGenerator } = require('../support/utils')

describe("Statistics Tests", () => {
  before(() => {
    cy.startUp()

    cy.fixture('expenses').then(function(expensesData) {
      const eg = new ExpenseGenerator(expensesData) 
      const expenses = eg.generateExpenses()
      cy.wrap(expenses).as('expenses')

      for(let expense of expenses) {
        cy.addExpenseWithAPI(expense)
      }
    })

    cy.fixture('biggestExpense').then(function(biggestExpenseData) {
      const biggestCategoryExpense = new Expense(biggestExpenseData)
      cy.addExpenseWithAPI(biggestCategoryExpense)
    })

    cy.fixture('smallestExpense').then(function(smallestExpenseData) {
      const smallestCategoryExpense = new Expense(smallestExpenseData)
      cy.addExpenseWithAPI(smallestCategoryExpense)
    })

    cy.visit(Cypress.config().chartsUrl)
  })

  beforeEach(function() {
    cy.fixture('expenses').then(function(expensesData) {
      const eg = new ExpenseGenerator(expensesData)
      const expenses = eg.generateExpenses()
      cy.wrap(expenses).as('expenses')
    })

    cy.fixture('biggestExpense').then(function(biggestExpenseData) {
      const biggestCategoryExpense = new Expense(biggestExpenseData)
      this.expenses.push(biggestCategoryExpense)
      cy.wrap(biggestExpenseData).as('biggestCategoryExpense')
    })

    cy.fixture('smallestExpense').then(function(smallestExpenseData) {
      const smallestCategoryExpense = new Expense(smallestExpenseData)
      this.expenses.push(smallestCategoryExpense)
      cy.wrap(smallestExpenseData).as('smallestCategoryExpense')
    })
    
    Cypress.Cookies.preserveOnce('sessionid')
  })

  it('should show correct current month total expenses', function() {
    const datesAndAmountsData = {}
    let currentMonthExpenses = 0

    for(let expense of this.expenses) {
      utils.aggregateToObjByKey(
        datesAndAmountsData, 
        expense.getDateOnExpenseTableFormat(), 
        expense.amount) 
    }

    for(let [date, amount] of Object.entries(datesAndAmountsData)) {
      const currentMonth = utils.getCurrentMonthNumber()
      const yearAndMonthPrefix = `2021-${currentMonth}`;
      
      if(date.includes(yearAndMonthPrefix)) {
        currentMonthExpenses += amount
      }
    }
    
    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-current-month-expenses]')
      .should('be.visible')
      .and('contain', `€ ${currentMonthExpenses.toFixed(2)}`)
  })

  it('should show correct last month total expenses', function() {
    const datesAndAmountsData = {}
    let lastMonthExpenses = 0

    for(let expense of this.expenses) {
      utils.aggregateToObjByKey(
        datesAndAmountsData, 
        expense.getDateOnExpenseTableFormat(), 
        expense.amount) 
    }

    for(let [date, amount] of Object.entries(datesAndAmountsData)) {        
      const lastMonth = utils.getLastMonthNumber()
      const yearAndLastMonthPrefix = `2021-${lastMonth}`;
      
      if(date.includes(yearAndLastMonthPrefix)) {
        lastMonthExpenses += amount
      }
    }

    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-last-month-expenses]')
      .should('be.visible')
      .and('contain', `€ ${lastMonthExpenses.toFixed(2)}`) 
  
  })
  
  it('should show correct current vs last month expense comparison', function() {
    const datesAndAmountsData = {}
    let currentMonthExpenses = 0
    let lastMonthExpenses = 0

    for(let expense of this.expenses) {
      utils.aggregateToObjByKey(
        datesAndAmountsData,  
        expense.getDateOnExpenseTableFormat(), 
        expense.amount) 
    }

    for(let [date, amount] of Object.entries(datesAndAmountsData)) {
      const currentMonth = utils.getCurrentMonthNumber()
      const yearAndMonthPrefix = `2021-${currentMonth}`;

      const lastMonth = utils.getLastMonthNumber()
      const yearAndLastMonthPrefix = `2021-${lastMonth}`;

      if(date.includes(yearAndMonthPrefix)) {
        currentMonthExpenses += amount
      }
      
      if(date.includes(yearAndLastMonthPrefix)) {
        lastMonthExpenses += amount
      }      
    }

    let percentageDifference = utils.getPercentageDiff(
      currentMonthExpenses, lastMonthExpenses)
    
    if(percentageDifference !== 0) {
      percentageDifference = percentageDifference.toFixed(2)
    }

    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-current-month-vs-last-month-comparison]')
      .should('be.visible')
      .and('contain', percentageDifference)  

  })

  it('should show correct monthly expenses average', function() {
    const datesAndAmountsData = {}
    const expensesByMonth = {}

    for(let expense of this.expenses) {
      utils.aggregateToObjByKey(
        datesAndAmountsData,  
        expense.getDateOnExpenseTableFormat(), 
        expense.amount) 
    }

    for(let [date, amount] of Object.entries(datesAndAmountsData)) {
      const monthNums = utils.getMonthNums()
      const yearAndMonthPrefixes = []

      monthNums.forEach((monthNum) => {
        yearAndMonthPrefixes.push(utils.getYearAndMonthPrefix(monthNum))
      })
      
      yearAndMonthPrefixes.forEach((prefix) => {
        // Compare month prefixes with dates.
        if(date.includes(prefix)) {
          // Group expenses per month.
          utils.aggregateToObjByKey(expensesByMonth, prefix, amount)
        }  
      })  
    }

    const expenseAmountsByMonth = Object.values(expensesByMonth)
    const numExpenseMonths = expenseAmountsByMonth.length
    const totalExpenses = expenseAmountsByMonth.reduce((a, b) => a + b)

    const averageExpensesByMonth = (totalExpenses / numExpenseMonths).toFixed(2)

    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-monthly-expense-average]').should('be.visible')
      .and('contain', `${averageExpensesByMonth}`)

  })

  it('should show correct daily expenses average', function() {
    const datesAndAmountsData = {}
  
    for(let expense of this.expenses) {
      utils.aggregateToObjByKey(
        datesAndAmountsData,  
        expense.getDateOnExpenseTableFormat(), 
        expense.amount) 
    }
  
    const expensesByDay = datesAndAmountsData
    
    const expenseAmountsByDay = Object.values(expensesByDay)
    const totalExpenses = expenseAmountsByDay.reduce((a, b) => a + b)
    const numExpenseDays = expenseAmountsByDay.length

    const averageExpensesByDay = (totalExpenses / numExpenseDays).toFixed(2)

    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-daily-expense-average]').should('be.visible')
      .and('contain', `${averageExpensesByDay}`)

  })

  it("should show correct biggest category expense", function() {  
    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-biggest-category-expense]').should('be.visible')
      .and('contain', `${this.biggestCategoryExpense.category}:`)
      .and('contain', `€ ${this.biggestCategoryExpense.amount}`)
  })

  it("should show correct smallest category expense", function() {
    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-smallest-category-expense]').should('be.visible')
      .and('contain', `${this.smallestCategoryExpense.category}:`)
      .and('contain', `€ ${this.smallestCategoryExpense.amount}`)
  })

  it("should show correct smallest expense", function() {
    const expenseAmounts = []
    for(let expense of this.expenses) {
      expenseAmounts.push(expense.amount)
    }
    const smallestExpense = Math.min(...expenseAmounts)
    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-smallest-expense]').should('be.visible')
      .and('contain', `€ ${smallestExpense}`)
  })

  it("should show correct biggest expense", function() {
    const expenseAmounts = []
    for(let expense of this.expenses) {
      expenseAmounts.push(expense.amount)
    }
    const biggestExpense = Math.max(...expenseAmounts)
    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-biggest-expense]').should('be.visible')
      .and('contain', `€ ${biggestExpense}`)
  })

  it("should show correct total expenses", function() {
    let totalExpenses = 0

    for(let expense of this.expenses) {
      totalExpenses += expense.amount
    }

    cy.visit(Cypress.config().chartsUrl)
    cy.get('[data-test=stats-total-expenses]').should('be.visible')
      .and('contain', `€ ${totalExpenses.toFixed(2)}`)
  })

})

