/// <reference types="cypress" />
const testuserData = require("../../fixtures/testuser.json");

describe("Expense API Tests", () => {
  const apiUrl = "http://localhost:8000/api";
  let accessToken = null;

  // Log in and store the access token for further requests
  before(() => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/login/`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        username: testuserData.username,
        password: testuserData.password,
      },
    }).then((res) => {
      accessToken = res.body.access;
    });
  });

  it("GET - /api/expenses/ - should retrieve all existing expenses", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/expenses/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      expect(Array.isArray(res.body)).to.be.true;
      expect(res.status).to.eq(200);
    });
  });

  it("POST - /api/expenses/create/ - should create a new expense", () => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/expenses/create/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        amount: 150,
        content: "PS1",
        category: "Electronics",
        source: "MediaMarkt",
        date: new Date(),
      },
    }).then((res) => {
      expect(res.status).to.eq(201);

      const newExpense = res.body;
      expect(newExpense).to.have.property("amount", parseFloat(150).toFixed(2));
      expect(newExpense).to.have.property("content", "PS1");
      expect(newExpense).to.have.property("category", "Electronics");
      expect(newExpense).to.have.property("source", "MediaMarkt");
      expect(newExpense).to.have.property("date");
    });
  });

  it("PUT - /api/expenses/update/ - should update an existing expense", () => {
    // First create an expense, store  it's id and then use that id to update the correct expense
    cy.request({
      method: "POST",
      url: `${apiUrl}/expenses/create/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        amount: 150,
        content: "PS1",
        category: "Electronics",
        source: "MediaMarkt",
        date: new Date(),
      },
    }).then((res) => {
      const newExpense = res.body;
      cy.request({
        method: "PUT",
        url: `${apiUrl}/expenses/update/${newExpense.id}/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          amount: 200,
          content: "PS3",
          category: "Electronics",
          source: "MediaMarkt",
          date: new Date(),
        },
      }).then((res) => {
        expect(res.status).to.eq(204);

        const newExpense = res.body;
        expect(newExpense).to.have.property(
          "amount",
          parseFloat(200).toFixed(2)
        );
        expect(newExpense).to.have.property("content", "PS3");
        expect(newExpense).to.have.property("category", "Electronics");
        expect(newExpense).to.have.property("source", "MediaMarkt");
        expect(newExpense).to.have.property("date");
      });
    });
  });

  it("DELETE - /api/expenses/delete/ - should delete an existing expense", () => {
    // First create an expense, store  it's id and then use that id to update the correct expense
    cy.request({
      method: "POST",
      url: `${apiUrl}/expenses/create/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        amount: 150,
        content: "PS1",
        category: "Electronics",
        source: "MediaMarkt",
        date: new Date(),
      },
    }).then((res) => {
      const newExpense = res.body;
      cy.request({
        method: "DELETE",
        url: `${apiUrl}/expenses/delete/${newExpense.id}/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(204);
      });
    });
  });
});
