describe("Error page Tests", () => {
  before(() => {
    cy.loginWithAPI();
  })

  it.skip("should display 404 page", function() {
    cy.visit('/' + 'non_existing_page', {failOnStatusCode: false})
    cy.get('body > div.container')
      .and('contain', 'The item you requested is not available. (404)')    
  })
})

