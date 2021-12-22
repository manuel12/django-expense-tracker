describe("Logout Tests", () => {
  before(function() {
    cy.startUp()
  })
  
  it("should log out the user.", () => {
    cy.get('a[href="/accounts/logout/"]').click()

    cy.url().should('include', 'accounts/login/?next=/')
    cy.get('#user-greet').should('be.visible')
      .and('contain', 'You are not logged in')
      .and('contain', 'Sign Up')
      .and('contain', 'Log In')
  })
})