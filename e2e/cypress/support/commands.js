import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";

addMatchImageSnapshotCommand({
  failureThreshold: 0.1,            // threshold for entire image
  failureThresholdType: 'percent',  // percent of image or number of pixels
});

const { Expense, ExpenseGenerator, makeAPICall } = require("../support/utils");

Cypress.Commands.add("loginAndCleanUp", () => {
  cy.clearCookie("sessionid");
  cy.loginWithAPI();
  cy.request({
    method: "GET",
    url: "delete-testuser-data/",
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add("login", (user, password) => {
  cy.visit("/");
  cy.get("#id_username")
    .type(user)
    .get("#id_password")
    .type(password)
    .get("[data-test=login]")
    .click();
});

Cypress.Commands.add("loginWithAPI", () => {
  cy.visit("/");
  cy.fixture("testuser").then((user) => {
    makeAPICall("login", {
      username: user.username,
      password: user.password,
    });
  });
});

Cypress.Commands.add("logout", () => {
  cy.url().then((url) => {
    const isLoggedIn =
      !url.includes(Cypress.config("signupUrl")) && !url.includes(Cypress.config("loginUrl"));
      if (isLoggedIn) cy.get("p > a").click();
  });
});

Cypress.Commands.add("loginWithAdmin", () => {
  cy.visit("http://localhost:8000/admin");
  cy.get("#id_username").type(Cypress.env("adminUser"));
  cy.get("#id_password").type(Cypress.env("adminPass"));
  cy.get(".submit-row > input").click();
})

Cypress.Commands.add("logoutWithAdmin", () => {
  cy.visit("/admin/logout/");
})

Cypress.Commands.add("deleteTestuser", (username) => {
  cy.loginWithAdmin();
  cy.visit("http://localhost:8000/admin/auth/user/");

  cy.get("tbody > tr")
    .first()
    .then(($el) => {

      const textContent = $el[0].textContent;
      if (textContent.includes(username)) {
        cy.get(":nth-child(1) > .action-checkbox > .action-select").click();
        cy.get("select").select("Delete selected users")
        cy.get(".button").click()
        cy.get("[type='submit']").click()
      }
    });
});

Cypress.Commands.add("addExpense", (data, submit = true) => {
  cy.visit("/");

  cy.get("[data-test=add-expense]").click();
  cy.get("#id_amount")
    .clear()
    .type(data.amount)
    .get("#id_content")
    .type(data.content)
    .get("#id_category")
    .select(data.category)
    .get("#id_source")
    .type(data.source);

  if (data.date) cy.get("#id_date").clear().type(data.date);
  if (submit) cy.get("[data-test=add-expense-save]").click();
});

Cypress.Commands.add("addExpenseWithAPI", (data) => {
  cy.visit("add/");
  makeAPICall("addExpense", data);
});

Cypress.Commands.add("addExpensesWithAPI", (data) => {
  cy.visit("add/");
  makeAPICall("addExpenses", data);
});

Cypress.Commands.add("updateExpenseField", (field, value, submit = true) => {
  if (field == "category") cy.get(`#id_${field}`).select(value);
  else cy.get(`#id_${field}`).clear().type(value);

  if (submit) cy.get("[data-test=update-expense-save]").click();
});

Cypress.Commands.add("addFixtureExpensesAndAlias", () => {
  cy.fixture("expenses").then(function (expensesData) {
    const eg = new ExpenseGenerator(expensesData);
    const expenses = eg.generateExpenses();
    const serializedExpenses = eg.generateSerializedExpenses();
    cy.wrap(expenses).as("expenses");

    let stringifyedExpenses = JSON.stringify(serializedExpenses);
    cy.addExpensesWithAPI(stringifyedExpenses);
  });

  cy.fixture("biggestExpense").then(function (biggestExpenseData) {
    const biggestCategoryExpense = new Expense(biggestExpenseData);
    cy.addExpenseWithAPI(biggestCategoryExpense);
  });

  cy.fixture("smallestExpense").then(function (smallestExpenseData) {
    const smallestCategoryExpense = new Expense(smallestExpenseData);
    cy.addExpenseWithAPI(smallestCategoryExpense);
  });
});

Cypress.Commands.add("deleteExpensesWithAPI", (href) => {
  cy.visit(href);
  makeAPICall("deleteExpenses", { href: href });
});

Cypress.Commands.add("addBudget", (data, submit = true) => {
  cy.visit("/");
  cy.get("[data-test=add-budget]").click();
  cy.get("#id_amount").clear().type(data.amount);

  if (submit) cy.get("[data-test=add-budget-save]").click();
});

Cypress.Commands.add("addBudgetWithAPI", (data) => {
  cy.visit("/add-budget/");
  makeAPICall("addBudget", data);
});

Cypress.Commands.add("updateBudgetField", (value, submit = true) => {
  cy.get(`#id_amount`).clear().type(value);
  if (submit) cy.get("[data-test=update-budget-save]").click();
});

Cypress.Commands.add("deleteBudget", () => {
  cy.get("[data-test=delete-budget]").click();
  cy.get("[data-test=delete-budget-yes]").click();
});

Cypress.Commands.add("deleteBudgetWithAPI", () => {
  cy.visit("/delete-budget/");
  makeAPICall("deleteBudget");
});

Cypress.Commands.add("deleteElementIfExists", (elementType) => {
  const elementToDeleteDataAttr =
    elementType == "expense"
      ? "[data-test^=delete-expense-]"
      : "[data-test=delete-budget]";

  cy.visit("/");
  cy.get("body").then((body) => {
    if (body.find(elementToDeleteDataAttr).length > 0) {
      cy.log(
        `element has [${body.find(elementToDeleteDataAttr).length}] ocurrences`
      );

      cy.get(elementToDeleteDataAttr)
        .invoke("attr", "href")
        .then((href) => {
          elementType == "expense"
            ? cy.deleteExpensesWithAPI(href)
            : cy.deleteBudgetWithAPI();
          cy.deleteElementIfExists(elementType);
        });
    }
  });
});
