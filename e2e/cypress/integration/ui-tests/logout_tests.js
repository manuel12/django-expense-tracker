describe("Logout Tests", () => {
  before(function () {
    cy.loginAndCleanUp();
  });

  it("should log out the user.", () => {
    const logoutLink = 'a[href="/accounts/logout/"]';
    cy.get(logoutLink).click();

    cy.url().should("include", "accounts/login/?next=/");
    cy.get("#user-greet")
      .should("be.visible")
      .and("contain", "You are not logged in")
      .and("contain", "Sign Up")
      .and("contain", "Log In");
  });
});
