const getPercentageDiff = (a, b) => {
  if (a === 0 || b === 0) {
    return 0;
  }
  return (a / b) * 100;
};

const aggregateToObjByKey = (obj, key, value) => {
  if (!obj[key]) {
    obj[key] = value;
  } else {
    obj[key] += value;
  }
  return obj;
};

const getDatesAndAmounts = (expenses) => {
  const datesAndAmounts = {};

  for (let expense of expenses) {
    aggregateToObjByKey(datesAndAmounts, expense.date, expense.amount);
  }

  return datesAndAmounts;
};

const getMonthNums = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const getMonthDateSections = () => {
  // Returns an array of month date sections.
  // On a date "2020-12-31" a month section equals "-12-".
  return [
    "-01-",
    "-02-",
    "-03-",
    "-04-",
    "-05-",
    "-06-",
    "-07-",
    "-08-",
    "-09-",
    "-10-",
    "-11-",
    "-12-",
  ];
};

const getCurrentMonthNumber = () => {
  const date = new Date();
  return String(date.getMonth() + 1).padStart(2, "0");
};

const getCurrentMonthName = () => {
  const date = new Date();
  return monthNames[date.getMonth()];
};

const getLastMonthNumber = () => {
  const date = new Date();
  return String(date.getMonth() === 0 ? 12 : date.getMonth()).padStart(2, "0");
};

const getLastMonthName = () => {
  const date = new Date();
  return monthNames[date.getMonth() - 1];
};

const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
};

const getTokenAlias = () => {
  cy.get("[name=csrfmiddlewaretoken]").invoke("attr", "value").as("csrfToken");
};

const makeAPICall = (callName, data) => {
  getTokenAlias();

  cy.get("@csrfToken").then((token) => {
    const [url, body] = getCallUrlAndBody(callName, data, token);

    cy.request({
      method: "POST",
      url: url,
      encoding: "utf8",
      form: true,
      body: body,
    });

    cy.visit("/");
  });
};

const getCallUrlAndBody = (callName, data, token) => {
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

    case "createExpense":
      url = "create/";
      body = {
        amount: data.amount,
        content: data.content,
        category: data.category,
        source: data.source,
        date: data.date,
        csrfmiddlewaretoken: token,
      };
      return [url, body];

    case "createExpenses":
      url = "add-testuser-data/";
      body = {
        expenses: data,
        csrfmiddlewaretoken: token,
      };
      return [url, body];

    case "deleteExpenses":
      url = "delete-testuser-data/";
      body = {
        csrfmiddlewaretoken: token,
        submit: "",
      };
      return [url, body];

    case "createBudget":
      url = "create-budget/";
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
