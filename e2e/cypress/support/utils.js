const { DateGenerator } = require("./utils/date-generator");
const { ExpenseGenerator } = require("./utils/expense-generator");
const { Expense } = require("./utils/expense");
const { Budget } = require("./utils/budget");

const {
  getPercentageDiff,
  aggregateToObjByKey,
  getDatesAndAmounts,
  getMonthNums,
  getCurrentMonthNumber,
  getLastMonthNumber,
  getCurrentYear,
  getMonthDateSections,
  getCurrentMonthName,
  getLastMonthName,
  makeAPICall,
} = require("./utils/utils");

module.exports = {
  DateGenerator,
  ExpenseGenerator,
  Expense,
  Budget,

  getPercentageDiff,
  aggregateToObjByKey,
  getDatesAndAmounts,
  getMonthNums,
  getCurrentMonthNumber,
  getLastMonthNumber,
  getCurrentYear,
  getMonthDateSections,
  getCurrentMonthName,
  getLastMonthName,
  makeAPICall,
};