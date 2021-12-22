class DateGenerator {
  static getDate(date) {
    return date ? new Date(date) : new Date();
  }

  static getDateOneMonthAgo() {
    let date = DateGenerator.getDate();
    date = date.setMonth(date.getMonth() - 1);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateTwoMonthAgo() {
    let date = DateGenerator.getDate();
    date = date.setMonth(date.getMonth() - 2);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateThreeMonthAgo() {
    let date = DateGenerator.getDate();
    date = date.setMonth(date.getMonth() - 3);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateOneWeekAgo() {
    let date = DateGenerator.getDate();
    date = date.setDate(date.getDate() - 7);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateTwoWeeksAgo() {
    let date = DateGenerator.getDate();
    date = date.setDate(date.getDate() - 14);
    return DateGenerator.getFormatedDate(date);
  }

  static getDateThreeWeeksAgo() {
    let date = DateGenerator.getDate();
    date = date.setDate(date.getDate() - 21);
    return DateGenerator.getFormatedDate(date);
  }

  static getFormatedDate(dateParam) {
    /*  Returns a date formatted such that it is a valid date for input forms.  */
    let date = dateParam ? new Date(dateParam) : new Date();
    const dd = date.getDate();
    const ddStr = String(dd).padStart(2, "0");
    const mm = date.getMonth() + 1;
    const mmStr = String(mm).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${yyyy}-${mmStr}-${ddStr}`;
  }
}

class ExpenseGenerator {
  constructor(expensesByDate) {
    this.expensesByDate = expensesByDate;
  }

  generateExpenses() {
    const expenses = [];

    for (let dateSection in this.expensesByDate) {
      let dateSectionExpenses = this.expensesByDate[dateSection];
      for (let expenseData of dateSectionExpenses) {
        this.addDateToExpense(dateSection, expenseData);
        const expense = new Expense(expenseData);
        expenses.push(expense);
      }
    }
    return expenses;
  }

  addDateToExpense(date, expense) {
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

class Expense {
  constructor(data) {
    this.amount = data.amount;
    this.content = data.content;
    this.category = data.category;
    this.source = data.source;
    this.date = data.date || DateGenerator.getFormatedDate();
  }

  getDateOnExpenseTableFormat() {
    /*  Returns a date that matches the format of
        dates displayed on the expense table.
  
        date param must be string a date of the format 2021-01-31. */
    const date = new Date(this.date);
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
}

class Budget {
  constructor(data) {
    this.amount = data.amount;
  }

  getDecimalAmount(decimalPlaces = 2) {
    return this.amount.toFixed(decimalPlaces);
  }
}

const getPercentageDiff = (a, b) => {
  if (a === 0 || b === 0) {
    return 0;
  }
  return (a / b) * 100;
};

const getRandomObjKey = (obj) => {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random(1) * keys.length)];
  return randomKey;
};

const aggregateToObjByKey = (obj, key, value) => {
  if (!obj[key]) {
    obj[key] = value;
  } else {
    obj[key] += value;
  }
  return obj;
};

const monthNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const getMonthNums = () => monthNums;

const getYearAndMonthPrefix = (month) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  return `${currentYear}-${month}-`;
};

const getCurrentMonthNumber = () => {
  const date = new Date();
  return date.getMonth() + 1;
};

const getCurrentMonthName = () => {
  const date = new Date();
  return monthNames[date.getMonth()];
};

const getLastMonthNumber = () => {
  const date = new Date();
  return date.getMonth();
};

const getLastMonthName = () => {
  const date = new Date();
  return monthNames[date.getMonth() - 1];
};

const getTokenAlias = () => {
  cy.get("[name=csrfmiddlewaretoken]")
    .should("exist")
    .should("have.attr", "value")
    .as("csrfToken");
};

const makeAPICall = (callName, data) => {
  getTokenAlias();

  cy.get("@csrfToken").then((token) => {
    const [url, body] = getCallURLAndBody(callName, data, token);

    cy.request({
      method: "POST",
      url: url,
      form: true,
      body: body,
      headers: {
        "X-CSRFTOKEN": token,
      },
    });

    cy.visit("/");
  });
};

const getCallURLAndBody = (callName, data, token) => {
  let url, body;

  switch (callName) {
    case "login":
      url = "accounts/login/";
      body = {
        username: data.username,
        password: data.password,
        csrfmiddlewaretoken: token,
        next: "/",
      };
      return [url, body];

    case "addExpense":
      url = "add/";
      body = {
        amount: data.amount,
        content: data.content,
        category: data.category,
        source: data.source,
        date: data.date,
        csrfmiddlewaretoken: token,
      };
      return [url, body];

    case "deleteExpenses":
      url = "/delete-test-user-expenses";
      body = {
        csrfmiddlewaretoken: token,
        submit: "",
      };
      return [url, body];

    case "addBudget":
      url = "add-budget/";
      body = {
        amount: data.amount,
        csrfmiddlewaretoken: token,
      };
      return [url, body];

    case "deleteBudget":
      url = "delete-budget/";
      body = {
        csrfmiddlewaretoken: token,
        submit: "",
      };
      return [url, body];
    default:
      throw "callName param does match any of API call names available!";
  }
};

module.exports = {
  DateGenerator,

  ExpenseGenerator,
  Expense,
  Budget,

  getPercentageDiff,
  getRandomObjKey,
  aggregateToObjByKey,

  getMonthNums,
  getCurrentMonthNumber,
  getLastMonthNumber,

  getYearAndMonthPrefix,

  getCurrentMonthName,
  getLastMonthName,

  makeAPICall,
};
