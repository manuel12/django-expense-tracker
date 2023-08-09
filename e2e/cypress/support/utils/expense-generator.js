const { DateGenerator } = require("./date-generator");
const { Expense } = require("./expense");

/**
 * Class that generates an expense instances array.
 * Will fail if not given expensesByData object as parameter.
 *
 * Also handles assigning dates to expenses that require them such as
 * one week ago, one month ago or three months ago dates.
 *
 * Can generate a list of serialized expenses, as long as
 * the list of generated expenses is already populated.
 */
class ExpenseGenerator {
  constructor(expensesByDate) {
    if (!expensesByDate)
      throw "You must provide an object specifying expenses by date.";
    this.expensesByDate = expensesByDate;
    this.generatedExpenses = [];
  }

  generateExpenses() {
    const expenses = [];

    for (let dateSection in this.expensesByDate) {
      let dateSectionExpenses = this.expensesByDate[dateSection];

      for (let expenseData of dateSectionExpenses) {
        this.assignDateToExpense(dateSection, expenseData);
        const expense = new Expense(expenseData);
        expenses.push(expense);
      }
    }
    this.generatedExpenses = expenses;
    return expenses;
  }

  generateSerializedExpenses() {
    const serializedExpenses = [];
    for (let expense of this.generatedExpenses) {
      serializedExpenses.push(expense.serialize());
    }
    return serializedExpenses;
  }

  assignDateToExpense(date, expense) {
    if (date == "today") {
      expense["date"] = DateGenerator.getFormatedDate();
    } else if (date == "one_week_ago") {
      expense["date"] = DateGenerator.getDateOneWeekAgo();
    } else if (date == "two_weeks_ago") {
      expense["date"] = DateGenerator.getDateTwoWeeksAgo();
    } else if (date == "three_weeks_ago") {
      expense["date"] = DateGenerator.getDateThreeWeeksAgo();
    } else if (date == "one_month_ago") {
      expense["date"] = DateGenerator.getDateOneMonthAgo();
    } else if (date == "two_month_ago") {
      expense["date"] = DateGenerator.getDateTwoMonthAgo();
    } else if (date == "three_month_ago") {
      expense["date"] = DateGenerator.getDateThreeMonthAgo();
    } else {
      console.log("Unrecognized date given: ", date);
    }
  }
}

module.exports = { ExpenseGenerator };
