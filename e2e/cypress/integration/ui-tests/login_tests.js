describe("Login Tests", () => {
  beforeEach(() => {
    cy.visit('/')
    cy.fixture('testuser').as('testuser')
  })

  beforeEach(() => {
    const logoutLink = 'a[href="/accounts/logout/"]'
    cy.get('body').then((body) => {
      if(body.find(logoutLink).length > 0) {
        cy.get(logoutLink).click()
      } 
    })
  })

  it("should login with a valid username and password.", function() {
    cy.login(this.testuser.username, this.testuser.password)

    cy.url().should('eq', Cypress.config().baseUrl)
    cy.get('[data-test=user-greet]').should('be.visible')
      .and('contain', `Hi ${this.testuser.username}`)
      .and('contain', 'Log Out')
  })

  it("should not login with an invalid username and valid password.", function() {
    cy.login("fake@username.123", this.testuser.password)

    cy.url().should('eq', Cypress.config().loginUrl)

    cy.get('[data-test=user-greet]').should('be.visible')
      .and('contain', 'You are not logged in')
      .and('contain', 'Sign Up')
      .and('contain', 'Log In')

    cy.get('[data-test=container]')
      .should('contain', "Your username and password didn't match. Please try again.")
  })

  it("should not login with valid username and invalid password", function() {
    cy.login(this.testuser.username, "Fakepassword54321")

    cy.url().should('eq', Cypress.config().loginUrl)

    cy.get('[data-test=user-greet]').should('be.visible')
      .and('contain', 'You are not logged in')
      .and('contain', 'Sign Up')
      .and('contain', 'Log In')

    cy.get('[data-test=container]')
      .should('contain', "Your username and password didn't match. Please try again.")
  })
})