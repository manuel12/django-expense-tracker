/// <reference types="cypress" />
const testuserData = require("../../fixtures/testuser.json");

describe("Authentication API Tests", () => {
  const apiUrl = "http://localhost:8000/api";
  const ctx = {};

  it("POST - /api/login/ - should receive refresh and access token when login inwith existing user", () => {
    // Perform a failing request due to lack of token
    cy.request({
      method: "GET",
      url: `${apiUrl}/expenses/`,
      headers: {
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body.detail).to.eq(
        "Authentication credentials were not provided."
      );
    });

    // Get tokens by login
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
      expect(res.body).to.have.property("access");
      expect(res.body).to.have.property("refresh");

      const accessToken = res.body.access;
      ctx.accessToken = accessToken;

      // Use tokens to perform a succesful request
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
  });

  it("POST - /api/register/ - should receive refresh and access when registering new user", () => {
    // Use tokens to perform a failing request due to lack of token
    cy.request({
      method: "GET",
      url: `${apiUrl}/expenses/`,
      headers: {
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body.detail).to.eq(
        "Authentication credentials were not provided."
      );
    });

    // Register a new user
    cy.request({
      method: "POST",
      url: `${apiUrl}/register/`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        username: "newUser1",
        password: "testpass1",
      },
    }).then((res) => {
      expect(res.body.detail).to.eq("User registered successfully!");
    });

    // Check same user cannot be regisered again
    cy.request({
      method: "POST",
      url: `${apiUrl}/register/`,
      headers: {
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
      body: {
        username: "newUser1",
        password: "testpass1",
      },
    }).then((res) => {
      expect(res.body.error).to.eq("Username already exists");
    });
  });

  it("POST - /api/logout/ - should invalidate tokens when login out with existing user", () => {
    // Log in with existing user
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
      expect(res.body).to.have.property("access");
      expect(res.body).to.have.property("refresh");

      const accessToken = res.body.access;

      // Access a protected route using tokens
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

      // Logout user
      cy.request({
        method: "POST",
        url: `${apiUrl}/logout/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        expect(res.body.message).to.eq("Logout successful.");
      });
    });

    // Check user cannot access a protected route without tokens
    cy.request({
      method: "GET",
      url: `${apiUrl}/expenses/`,
      headers: {
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.body.detail).to.eq(
        "Authentication credentials were not provided."
      );
    });
  });

  after(() => {
    cy.deleteTestuser("newUser1", ctx.accessToken);
  });
});
