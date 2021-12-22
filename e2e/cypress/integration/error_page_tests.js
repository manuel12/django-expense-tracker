describe("Error page tests", () => {
  before(() => {
    cy.startUp()
  })

  it.skip("should show 404 page", function() {
    cy.visit('/' + 'non_existing_page')
    cy.get('body > div.container')
      .and('contain', 'The item you requested is not available. (404)')    
  })
})

