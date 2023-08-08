/// <reference types="cypress" />

const utils = require("../../support/utils");
const { Expense, ExpenseGenerator } = require("../../support/utils");

const expensesData = require("../../fixtures/expenses.json");
const biggestExpenseData = require("../../fixtures/biggest-expense.json");
const smallestExpenseData = require("../../fixtures/smallest-expense.json");

const formatNumberWithoutDecimals = (number) => {
  number = Number(number);

  if (Number.isInteger(number)) {
    return number.toString();
  } else {
    return number.toFixed(2);
  }
};

describe("Statistics Tests", () => {
  const ctx = {};

  beforeEach(() => {
    cy.loginAndCleanUp(ctx);

    cy.createFixtureExpenses(ctx);

    const currentMonth = utils.getCurrentMonthNumber();
    const currentYear = utils.getCurrentYear();
    const yearAndMonthPrefix = `${currentYear}-${currentMonth}`;
    ctx.yearAndMonthPrefix = yearAndMonthPrefix;

    const lastMonth = utils.getLastMonthNumber();
    const lastMonthYear = lastMonth === "12" ? currentYear - 1 : currentYear;
    const yearAndLastMonthPrefix = `${lastMonthYear}-${lastMonth}`;
    ctx.yearAndLastMonthPrefix = yearAndLastMonthPrefix;

    const eg = new ExpenseGenerator(expensesData);
    const expenses = eg.generateExpenses();
    ctx.expenses = expenses;

    const biggestCategoryExpense = new Expense(biggestExpenseData);
    ctx.expenses.push(biggestCategoryExpense);
    ctx.biggestCategoryExpense = biggestExpenseData;

    const smallestCategoryExpense = new Expense(smallestExpenseData);
    ctx.expenses.push(smallestCategoryExpense);
    ctx.smallestCategoryExpense = smallestExpenseData;

    cy.visit("/charts/");
  });

  it("should display correct current month total expenses", () => {
    const datesAndAmounts = utils.getDatesAndAmounts(ctx.expenses);
    let currentMonthExpenses = 0;

    for (let [date, amount] of Object.entries(datesAndAmounts))
      if (date.includes(ctx.yearAndMonthPrefix)) currentMonthExpenses += amount;

    if (currentMonthExpenses > 0)
      currentMonthExpenses = currentMonthExpenses.toFixed(2);

    cy.visit("/charts/");
    cy.get("[data-test=stats-current-month-expenses]")
      .should("be.visible")
      .and("contain", `€ ${currentMonthExpenses}`);
  });

  it("should display correct last month total expenses", () => {
    const datesAndAmounts = utils.getDatesAndAmounts(ctx.expenses);
    let lastMonthExpenses = 0;

    for (let [date, amount] of Object.entries(datesAndAmounts))
      if (date.includes(ctx.yearAndLastMonthPrefix))
        lastMonthExpenses += amount;

    if (lastMonthExpenses > 0) lastMonthExpenses = lastMonthExpenses.toFixed(2);

    cy.visit("/charts/");
    cy.get("[data-test=stats-last-month-expenses]")
      .should("be.visible")
      .and("contain", `€ ${lastMonthExpenses}`);
  });

  it("should display correct current vs last month expense percentage difference", () => {
    const datesAndAmounts = utils.getDatesAndAmounts(ctx.expenses);
    let currentMonthExpenses = 0;
    let lastMonthExpenses = 0;

    for (let [date, amount] of Object.entries(datesAndAmounts)) {
      if (date.includes(ctx.yearAndMonthPrefix)) currentMonthExpenses += amount;

      if (date.includes(ctx.yearAndLastMonthPrefix))
        lastMonthExpenses += amount;
    }

    let percentageDifference = utils.getPercentageDiff(
      currentMonthExpenses,
      lastMonthExpenses
    );

    if (percentageDifference !== 0)
      percentageDifference = percentageDifference.toFixed(2);

    cy.visit("/charts/");
    cy.get("[data-test=stats-current-month-vs-last-month-comparison]")
      .should("be.visible")
      .and("contain", formatNumberWithoutDecimals(percentageDifference));
  });

  it("should display correct monthly expenses average", () => {
    const datesAndAmounts = utils.getDatesAndAmounts(ctx.expenses);
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
          utils.aggregateToObjByKey(
            expensesByYearMonth,
            yearMonthDateSection,
            amount
          );
        }
      });
    }

    const expenseAmountsByMonth = Object.values(expensesByYearMonth);
    const numExpenseMonths = expenseAmountsByMonth.length;
    const totalExpenses = expenseAmountsByMonth.reduce((a, b) => a + b);
    const averageExpensesByMonth = (totalExpenses / numExpenseMonths).toFixed(
      2
    );

    cy.visit("/charts/");
    cy.get("[data-test=stats-monthly-expense-average]")
      .should("be.visible")
      .and("contain", `${averageExpensesByMonth}`);
  });

  it("should display correct daily expenses average", () => {
    const datesAndAmounts = utils.getDatesAndAmounts(ctx.expenses);
    const expensesByDay = datesAndAmounts;

    const expenseAmountsByDay = Object.values(expensesByDay);
    const totalExpenses = expenseAmountsByDay.reduce((a, b) => a + b);
    const numExpenseDays = expenseAmountsByDay.length;
    const averageExpensesByDay = (totalExpenses / numExpenseDays).toFixed(2);

    cy.visit("/charts/");
    cy.get("[data-test=stats-daily-expense-average]")
      .should("be.visible")
      .and("contain", `${averageExpensesByDay}`);
  });

  it("should display correct biggest category expense", () => {
    cy.visit("/charts/");
    cy.get("[data-test=stats-biggest-category-expense]")
      .should("be.visible")
      .and("contain", `${ctx.biggestCategoryExpense.category}:`)
      .and("contain", `€ ${ctx.biggestCategoryExpense.categoryExpenseAmount}`);
  });

  it("should display correct smallest category expense", () => {
    cy.visit("/charts/");
    cy.get("[data-test=stats-smallest-category-expense]")
      .should("be.visible")
      .and("contain", `${ctx.smallestCategoryExpense.category}:`)
      .and("contain", `€ ${ctx.smallestCategoryExpense.categoryExpenseAmount}`);
  });

  it("should display correct smallest expense", () => {
    const expenseAmounts = [];
    for (let expense of ctx.expenses) expenseAmounts.push(expense.amount);

    const smallestExpense = Math.min(...expenseAmounts);
    cy.visit("/charts/");
    cy.get("[data-test=stats-smallest-expense]")
      .should("be.visible")
      .and("contain", `€ ${smallestExpense}`);
  });

  it("should display correct biggest expense", () => {
    const expenseAmounts = [];
    for (let expense of ctx.expenses) expenseAmounts.push(expense.amount);

    const biggestExpense = Math.max(...expenseAmounts);
    cy.visit("/charts/");
    cy.get("[data-test=stats-biggest-expense]")
      .should("be.visible")
      .and("contain", `€ ${biggestExpense}`);
  });

  it("should display correct total expenses", () => {
    let totalExpenses = 0;
    for (let expense of ctx.expenses) totalExpenses += expense.amount;
    if (totalExpenses > 0) totalExpenses = totalExpenses.toFixed(2);

    cy.visit("/charts/");
    cy.get("[data-test=stats-total-expenses]")
      .should("be.visible")
      .and("contain", `€ ${totalExpenses}`);
  });
});
