/// <reference types="cypress" />

import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";

addMatchImageSnapshotCommand({
  failureThreshold: 0.05,
  failureThresholdType: "pixel",
});

const { Expense, ExpenseGenerator, makeAPICall } = require("../support/utils");

const testuserData = require("../fixtures/testuser.json");
const expensesData = require("../fixtures/expenses.json");
const biggestExpenseData = require("../fixtures/biggest-expense.json");
const smallestExpenseData = require("../fixtures/smallest-expense.json");

const apiUrl = "http://localhost:8000/api";

Cypress.Commands.add("loginAndCleanUp", (setTokens, cb) => {
  /**
   * Clear session cookies, login and delete previous
   * test data.
   */

  // cy.clearCookie("sessionid");
  cy.loginWithAPI(setTokens);

  cy.request({
    method: "GET",
    url: "delete-testuser-data/",
  }).then((response) => {
    expect(response.status).to.eq(200);
  });

  cb && cb();
});

Cypress.Commands.add("loginWithUI", (user, password) => {
  /**
   * Login the a normal user by interacting with the UI.
   */

  cy.visit("/accounts/login");
  cy.get("[data-test=username]")
    .type(user)
    .get("[data-test=password]")
    .type(password)
    .get("[data-test=login]")
    .click();
});

Cypress.Commands.add("loginWithAPI", (setTokens) => {
  /**
   * Login programatically using the API.
   */

  cy.visit("/");

  cy.request({
    method: "POST",
    url: `${apiUrl}/login/`,
    body: {
      username: testuserData.username,
      password: testuserData.password,
    },
  }).then((res) => {
    const { access, refresh } = res.body;
    setTokens(res.body);

    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("accessToken", JSON.stringify(access));
      },
    });

    cy.deleteTestuserData(access);
  });

  // makeAPICall("login", {
  //   username: testuserData.username,
  //   password: testuserData.password,
  // });
});

Cypress.Commands.add("logout", () => {
  /**
   * Logout the user by clicking the logout link.
   */

  cy.get("body").then((body) => {
    if (body.find("[data-test=logout-link]").length > 0) {
      cy.get("[data-test=logout-link]").click();
    }
  });
});

Cypress.Commands.add("loginAdminWithUI", () => {
  /**
   * Login the admin user by interacting with the UI
   * and using credentials found on cypress.env.json
   */

  cy.visit(`${Cypress.config("baseUrl")}admin`);
  cy.get("#id_username").type(Cypress.config("adminUser"));
  cy.get("#id_password").type(Cypress.config("adminPass"));
  cy.get(".submit-row > input").click();
});

Cypress.Commands.add("logoutWithAdmin", () => {
  /**
   * Logout the admin user.
   */

  cy.visit("/admin/logout/");
});

Cypress.Commands.add("deleteTestuser", (username, accessToken) => {
  /**
   * Delete a specific testuser by interacting with
   * the admin panel UI.
   */

  cy.request({
    method: "DELETE",
    url: `${apiUrl}/delete-user/${username}/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    failOnStatusCode: false,
  });
  // cy.loginAdminWithUI();
  // cy.visit(`${Cypress.config("baseUrl")}admin/auth/user/`);

  // cy.get("tbody > tr")
  //   .first()
  //   .then(($el) => {
  //     const textContent = $el[0].textContent;
  //     if (textContent.includes(username)) {
  //       cy.get(":nth-child(1) > .action-checkbox > .action-select").click();
  //       cy.get("select").select("Delete selected users");
  //       cy.get(".button").click();
  //       cy.get("[type='submit']").click();
  //     }
  //   });
});

Cypress.Commands.add("createExpenseWithUI", (data, submit = true) => {
  /**
   * Creates an expense by interacting the UI.
   * filling out the form and clicking the submit button.
   *
   * In case submit is set to false the submit button won't be clicked.
   * This is needed for some tests.
   */

  cy.visit("/");

  cy.get("[data-test=create-expense]").click();
  cy.get("[data-test=expense-input-amount]")
    .clear()
    .type(data.amount)
    .get("[data-test=expense-input-content]")
    .type(data.content)
    .get("[data-test=expense-input-category]")
    .select(data.category)
    .get("[data-test=expense-input-source]")
    .type(data.source);

  if (data.date)
    cy.get("[data-test=expense-input-date]").clear().type(data.date);
  if (submit) cy.get("[data-test=create-expense-save]").click();
});

Cypress.Commands.add("createExpenseWithAPI", (data, ctx) => {
  /**
   * Creates an expense by using the API.
   */

  const accessToken = ctx.access;
  console.log(accessToken);

  cy.request({
    method: "POST",
    url: `${apiUrl}/expenses/create/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  }).then((res) => {
    expect(res.status).to.eq(201);
  });

  // cy.visit("create/");
  // makeAPICall("createExpense", data);
});

Cypress.Commands.add("createExpensesWithAPI", (data, token) => {
  /**
   * Creates a group of expenses by using the API.
   */

  cy.visit("create/");
  makeAPICall("createExpenses", data, token);
});

Cypress.Commands.add("updateExpenseField", (field, value, submit = true) => {
  /**
   * Updates a specific field on an expense update form.
   *
   * In case submit is set to false the submit button won't be clicked.
   */

  if (field == "category")
    cy.get(`[data-test=expense-input-${field}]`).select(value);
  else cy.get(`[data-test=expense-input-${field}]`).clear().type(value);

  if (submit) cy.get("[data-test=update-expense-save]").click();
});

Cypress.Commands.add("createFixtureExpenses", (ctx) => {
  /**
   * Creates expenses from the fixtures: expenses, biggestExpense
   * and smallestExpense -in order to use as test data in statistics.spec.js.
   */

  console.log(ctx);

  const accessToken = ctx.access;
  console.log(accessToken);

  const eg = new ExpenseGenerator(expensesData);
  const expenses = eg.generateExpenses();
  const serializedExpenses = eg.generateSerializedExpenses();

  let stringifyedExpenses = JSON.stringify(serializedExpenses);
  cy.createExpensesWithAPI(stringifyedExpenses, accessToken);

  const biggestCategoryExpense = new Expense(biggestExpenseData);
  cy.createExpenseWithAPI(biggestCategoryExpense, ctx);

  const smallestCategoryExpense = new Expense(smallestExpenseData);
  cy.createExpenseWithAPI(smallestCategoryExpense, ctx);
});

Cypress.Commands.add("deleteExpensesWithAPI", (href) => {
  /**
   * Deletes a specific expense by using the API.
   */

  cy.visit(href);
  makeAPICall("deleteExpenses", { href: href });
});

Cypress.Commands.add("createBudgetWithUI", (data, submit = true) => {
  /**
   * Creates a budget by interacting the UI.
   * filling out the form and clicking the submit button.
   *
   * In case submit is set to false the submit button won't be clicked.
   * This is needed for some tests.
   */

  cy.visit("/");
  cy.get("[data-test=create-budget]").click();
  cy.get("[data-test=budget-input-amount]").clear().type(data.amount);

  if (submit) cy.get("[data-test=create-budget-save]").click();
});

Cypress.Commands.add("createBudgetWithAPI", (data, ctx) => {
  /**
   * Creates a budget by using the API.
   */

  const accessToken = ctx.access;
  console.log(accessToken);

  cy.request({
    method: "POST",
    url: `${apiUrl}/budget/create/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  }).then((res) => {
    expect(res.status).to.eq(201);
  });

  // cy.visit("/create-budget/");
  // makeAPICall("createBudget", data);
});

Cypress.Commands.add("updateBudgetField", (value, submit = true) => {
  /**
   * Updates the amount field on a budget update form.
   *
   * In case submit is set to false the submit button won't be clicked.
   */

  cy.get("[data-test=budget-input-amount]").clear().type(value);
  if (submit) cy.get("[data-test=update-budget-save]").click();
});

Cypress.Commands.add("deleteBudgetWithUI", () => {
  /**
   * Deletes a budget by interacting with the UI.
   */

  cy.get("[data-test=delete-budget]").click();
  cy.get("[data-test=delete-budget-yes]").click();
  cy.visit("/");
});

Cypress.Commands.add("deleteBudgetWithAPI", () => {
  /**
   * Deletes a budget by using the API.
   */

  console.log("On deleteBudgetWithAPI!");

  // cy.visit("/delete-budget/");
  // makeAPICall("deleteBudget");
});

Cypress.Commands.add("deleteElementIfExists", (elementType) => {
  /**
   * Deletes an element in case it is present on the page.
   *
   * The 2 elementType options are 'expense' or 'budget'.
   *
   * If elementType equals 'expense' all of the testuser expenses
   * will be deleted.
   */
  console.log("On deleteElementIfExists");
  const elementToDeleteDataAttr =
    elementType == "expense"
      ? "[data-test^=delete-expense-]"
      : "[data-test=delete-budget]";

  console.log(`elementToDeleteDataAttr: ${elementToDeleteDataAttr}`);

  cy.visit("/");
  cy.get("body").then((body) => {
    if (body.find(elementToDeleteDataAttr).length > 0) {
      console.log(
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
    } else {
      console.log(`No element with [${elementToDeleteDataAttr}] found`);
    }
  });
});

Cypress.Commands.add("deleteTestuserData", (accessToken) => {
  cy.request({
    method: "DELETE",
    url: `${apiUrl}/delete-testuser-data/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      username: testuserData.username,
      password: testuserData.password,
    },
  });
  cy.visit("/");
});
