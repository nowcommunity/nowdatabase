before('Reset database', () => {
  cy.resetDatabase()
})

const pageLoadTimeout = 30000

describe('Open each page, table view and detail view, and check at least some correct text appears', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('Locality works', () => {
    cy.visit('/locality')
    cy.contains('Name', { timeout: pageLoadTimeout }).should('be.visible')
    cy.contains('Country', { timeout: pageLoadTimeout }).should('be.visible')
    cy.visit('/locality/21050')
    cy.contains('Dmanisi', { timeout: pageLoadTimeout }).should('be.visible')
    cy.contains('Dating method', { timeout: pageLoadTimeout }).should('be.visible')
    cy.contains('Lithology', { timeout: pageLoadTimeout }).should('be.visible')
    cy.contains('olduvai', { timeout: pageLoadTimeout }).should('be.visible')
  })

  it('Species works', () => {
    cy.visit('/species')
    cy.location('pathname').should('eq', '/species')
    cy.contains('Order', { timeout: pageLoadTimeout }).should('be.visible')
    cy.visit('/species/21052/')
    cy.contains('21052 Simplomys simplicidens', { timeout: pageLoadTimeout }).should('be.visible')
  })

  it('Reference works', () => {
    cy.visit('/reference')
    cy.location('pathname').should('eq', '/reference')
    cy.contains('References', { timeout: pageLoadTimeout }).should('be.visible')
    cy.visit('/reference/10039')
    cy.contains('Reference type', { timeout: pageLoadTimeout }).should('be.visible')
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic', {
      timeout: pageLoadTimeout,
    }).should('be.visible')
  })

  it('Time Unit works', () => {
    cy.visit('/time-unit')
    cy.location('pathname').should('eq', '/time-unit')
    cy.contains('Sequence', { timeout: pageLoadTimeout }).should('be.visible')
    cy.visit('/time-unit/bahean?tab=0')
    cy.contains('Bahean', { timeout: pageLoadTimeout }).should('be.visible')
  })
})
