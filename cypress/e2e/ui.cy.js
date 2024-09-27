/*
  Tests for different buttons / paths the user may take. 
  Mostly to prove some user stories are complete
*/

before('Reset database', () => {
  cy.request(Cypress.env("databaseResetUrl"));
});

describe('Button Tests', () => {
    it('Buttons for Localities, Species, References, Cross-Search, Map & Time Units are visible', () => {
      cy.visit('/')
      cy.contains('Welcome').should('be.visible')
      cy.contains('Front Page').should('be.visible')
      cy.contains('Localities').should('be.visible')
      cy.contains('Species').should('be.visible')
      cy.contains('References').should('be.visible')
      cy.contains('Time Units').should('be.visible')
      cy.contains('Cross-Search').should('be.visible')
      cy.contains('Map').should('be.visible')
    })
  
    it('Localities button works', () => {
      cy.visit('/')
      cy.contains('Localities').click()
      cy.url().should('include', '/locality')
      cy.contains('Name').should('be.visible')
      cy.contains('Country').should('be.visible')
      cy.contains('Max age').should('be.visible')
      cy.contains('Min age').should('be.visible')
    })
  
    it('Front Page button works', () => {
      cy.visit('/locality')
      cy.contains('Front Page').click()
      cy.contains('Welcome').should('be.visible')
      cy.contains('Front Page').should('be.visible')
      cy.contains('Localities').should('be.visible')
      cy.contains('Species').should('be.visible')
      cy.contains('References').should('be.visible')
      cy.contains('Time Units').should('be.visible')
      cy.contains('Cross-Search').should('be.visible')
      cy.contains('Map').should('be.visible')
    })
  
    it('Species button works', () => {
      cy.visit('/')
      cy.contains('Species').click()
      cy.url().should('include', '/species')
      cy.contains('Order').should('be.visible')
      cy.contains('Family').should('be.visible')
      cy.contains('Genus').should('be.visible')
    })
  
    it('Time Units button works', () => {
      cy.visit('/')
      cy.contains('Time Units').click()
      cy.url().should('include', '/time-unit')
      cy.contains('Lower Bound').should('be.visible')
      cy.contains('Upper Bound').should('be.visible')
      cy.contains('Sequence').should('be.visible')
    })

    it('Cross Search button works', () => {
      cy.visit('/')
      cy.contains('Cross-Search').click()
      cy.url().should('include', '/crosssearch')
      cy.contains('Locality name').should('be.visible')
      cy.contains('Country').should('be.visible')
      cy.contains('Genus').should('be.visible')
      cy.contains('Species').should('be.visible')
    })

    it('Map button works', () => {
      cy.visit('/')
      cy.contains('Map').click()
      cy.url().should('include', '/map')
      cy.get('.leaflet-container').should('be.visible');
    })


    it('Link to species details from species tab', () => {
      cy.visit('/species')
      // Click the button with the SVG icon
      cy.get('[data-testid="ManageSearchIcon"]').first().click()
      cy.contains('Taxonomy').should('be.visible')
      cy.contains('Synonyms').should('be.visible')
      cy.contains('Diet').should('be.visible')
      cy.contains('Locomotion').should('be.visible')
      cy.contains('Size').should('be.visible')
      cy.contains('Teeth').should('be.visible')
      cy.contains('Localities').should('be.visible')
      cy.contains('Locality Species').should('be.visible')
      cy.contains('Updates').should('be.visible')
    })
  })
