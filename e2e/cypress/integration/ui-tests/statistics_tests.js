const utils = require("../../support/utils");
const { Expense, ExpenseGenerator } = require("../../support/utils");

describe("Statistics Tests", () => {
  before(() => {
    cy.loginAndCleanUp(true);
    cy.addFixtureExpensesAndAlias();

    const currentMonth = utils.getCurrentMonthNumber();
    const currentYear = utils.getCurrentYear();
    const yearAndMonthPrefix = `${currentYear}-${currentMonth}`;
    cy.wrap(yearAndMonthPrefix).as("yearAndMonthPrefix");

    const lastMonth = utils.getLastMonthNumber();
    const lastMonthYear = lastMonth === "12" ? currentYear - 1 : currentYear;
    const yearAndLastMonthPrefix = `${lastMonthYear}-${lastMonth}`;
    cy.wrap(yearAndLastMonthPrefix).as("yearAndLastMonthPrefix");

    cy.visit(Cypress.config().chartsUrl);
  });

  beforeEach(function () {
    cy.fixture("expenses").then(function (expensesData) {
      const eg = new ExpenseGenerator(expensesData);
      const expenses = eg.generateExpenses();
      cy.wrap(expenses).as("expenses");
    });

    cy.fixture("biggestExpense").then(function (biggestExpenseData) {
      const biggestCategoryExpense = new Expense(biggestExpenseData);
      this.expenses.push(biggestCategoryExpense);
      cy.wrap(biggestExpenseData).as("biggestCategoryExpense");
    });

    cy.fixture("smallestExpense").then(function (smallestExpenseData) {
      const smallestCategoryExpense = new Expense(smallestExpenseData);
      this.expenses.push(smallestCategoryExpense);
      cy.wrap(smallestExpenseData).as("smallestCategoryExpense");
    });

    Cypress.Cookies.preserveOnce("sessionid");
  });

  it("should display correct current month total expenses", function () {
    const datesAndAmounts = utils.getDatesAndAmounts(this.expenses);
    let currentMonthExpenses = 0;

    for (let [date, amount] of Object.entries(datesAndAmounts))
      if (date.includes(this.yearAndMonthPrefix))
        currentMonthExpenses += amount;

    if (currentMonthExpenses > 0)
      currentMonthExpenses = currentMonthExpenses.toFixed(2);

    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-current-month-expenses]")
      .should("be.visible")
      .and("contain", `€ ${currentMonthExpenses}`);
  });

  it("should display correct last month total expenses", function () {
    const datesAndAmounts = utils.getDatesAndAmounts(this.expenses);
    let lastMonthExpenses = 0;

    for (let [date, amount] of Object.entries(datesAndAmounts))
      if (date.includes(this.yearAndLastMonthPrefix))
        lastMonthExpenses += amount;

    if (lastMonthExpenses > 0) lastMonthExpenses = lastMonthExpenses.toFixed(2);

    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-last-month-expenses]")
      .should("be.visible")
      .and("contain", `€ ${lastMonthExpenses}`);
  });

  it("should display correct current vs last month expense percentage difference", function () {
    const datesAndAmounts = utils.getDatesAndAmounts(this.expenses);
    let currentMonthExpenses = 0;
    let lastMonthExpenses = 0;

    for (let [date, amount] of Object.entries(datesAndAmounts)) {
      if (date.includes(this.yearAndMonthPrefix))
        currentMonthExpenses += amount;

      if (date.includes(this.yearAndLastMonthPrefix))
        lastMonthExpenses += amount;
    }

    let percentageDifference = utils.getPercentageDiff(
      currentMonthExpenses,
      lastMonthExpenses
    );

    if (percentageDifference !== 0)
      percentageDifference = percentageDifference.toFixed(2);

    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-current-month-vs-last-month-comparison]")
      .should("be.visible")
      .and("contain", percentageDifference);
  });

  it("should display correct monthly expenses average", function () {
    const datesAndAmounts = utils.getDatesAndAmounts(this.expenses);
    const expensesByYearMonth = {};

    for (let [date, amount] of Object.entries(datesAndAmounts)) {
      // Creates an array with the month sections of a data string.
      // If date is "2020-12-31" then monthDateSection is "-12-".
      // So array will be ['-01-', '-02-', '-03-', '-04-',...]
      const monthDateSections = utils.getMonthDateSections();
      monthDateSections.forEach((monthDateSection) => {
        // Compare month sections with dates.
        if (date.includes(monthDateSection)) {
          // This will give us the "2020-12" section of a "2020-12-31" date.
          const yearMonthDateSection = date.slice(0, -3);
          // Group expenses by year-month.
          utils.aggregateToObjByKey(expensesByYearMonth, yearMonthDateSection, amount);
        }
      });
    }

    const expenseAmountsByMonth = Object.values(expensesByYearMonth);
    const numExpenseMonths = expenseAmountsByMonth.length;
    const totalExpenses = expenseAmountsByMonth.reduce((a, b) => a + b);
    const averageExpensesByMonth = (totalExpenses / numExpenseMonths).toFixed(
      2
    );

    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-monthly-expense-average]")
      .should("be.visible")
      .and("contain", `${averageExpensesByMonth}`);
  });

  it("should display correct daily expenses average", function () {
    const datesAndAmounts = utils.getDatesAndAmounts(this.expenses);
    const expensesByDay = datesAndAmounts;

    const expenseAmountsByDay = Object.values(expensesByDay);
    const totalExpenses = expenseAmountsByDay.reduce((a, b) => a + b);
    const numExpenseDays = expenseAmountsByDay.length;
    const averageExpensesByDay = (totalExpenses / numExpenseDays).toFixed(2);

    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-daily-expense-average]")
      .should("be.visible")
      .and("contain", `${averageExpensesByDay}`);
  });

  it("should display correct biggest category expense", function () {
    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-biggest-category-expense]")
      .should("be.visible")
      .and("contain", `${this.biggestCategoryExpense.category}:`)
      .and("contain", `€ ${this.biggestCategoryExpense.categoryExpenseAmount}`);
  });

  it("should display correct smallest category expense", function () {
    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-smallest-category-expense]")
      .should("be.visible")
      .and("contain", `${this.smallestCategoryExpense.category}:`)
      .and(
        "contain",
        `€ ${this.smallestCategoryExpense.categoryExpenseAmount}`
      );
  });

  it("should display correct smallest expense", function () {
    const expenseAmounts = [];
    for (let expense of this.expenses) expenseAmounts.push(expense.amount);

    const smallestExpense = Math.min(...expenseAmounts);
    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-smallest-expense]")
      .should("be.visible")
      .and("contain", `€ ${smallestExpense}`);
  });

  it("should display correct biggest expense", function () {
    const expenseAmounts = [];
    for (let expense of this.expenses) expenseAmounts.push(expense.amount);

    const biggestExpense = Math.max(...expenseAmounts);
    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-biggest-expense]")
      .should("be.visible")
      .and("contain", `€ ${biggestExpense}`);
  });

  it("should display correct total expenses", function () {
    let totalExpenses = 0;
    for (let expense of this.expenses) totalExpenses += expense.amount;
    if (totalExpenses > 0) totalExpenses = totalExpenses.toFixed(2);

    cy.visit(Cypress.config().chartsUrl);
    cy.get("[data-test=stats-total-expenses]")
      .should("be.visible")
      .and("contain", `€ ${totalExpenses}`);
  });
});
