before('Reset database', () => {
  cy.resetDatabase()
})

describe('Open each page, table view and detail view, and check at least some correct text appears', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('Locality works', () => {
    cy.visit('/locality')
    cy.location('pathname').should('eq', '/locality')
    cy.visit('/locality/21050?tab=0')
    cy.contains('Dating method')
    cy.contains('olduvai')
  })

  it('Species works', () => {
    cy.visit('/species')
    cy.location('pathname').should('eq', '/species')
    cy.visit('/species/21052')
    cy.contains('Class')
    cy.contains('Simplomys')
  })

  it('Reference works', () => {
    cy.visit('/reference')
    cy.location('pathname').should('eq', '/reference')
    cy.visit('/reference/10039')
    cy.contains('Reference type')
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic')
  })

  it('Time Unit works', () => {
    cy.visit('/time-unit')
    cy.location('pathname').should('eq', '/time-unit')
    cy.visit('/time-unit/langhian')
    cy.contains('Sequence')
    cy.contains('GCSS')
  })
})
