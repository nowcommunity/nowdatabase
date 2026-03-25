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
    cy.location('pathname', { timeout: pageLoadTimeout }).should('eq', '/locality')
    cy.visit('/locality/20920?tab=2')
    cy.location('pathname', { timeout: pageLoadTimeout }).should('eq', '/locality/20920')
    cy.get('[id=edit-button]', { timeout: pageLoadTimeout }).should('be.visible')
    cy.get('body').should('not.contain', 'Error loading data')
  })

  it('Species works', () => {
    cy.visit('/species')
    cy.location('pathname', { timeout: pageLoadTimeout }).should('eq', '/species')
    cy.visit('/species/21052/')
    cy.contains('21052 Simplomys simplicidens', { timeout: pageLoadTimeout }).should('be.visible')
  })

  it('Reference works', () => {
    cy.visit('/reference')
    cy.location('pathname', { timeout: pageLoadTimeout }).should('eq', '/reference')
    cy.visit('/reference/10039')
    cy.contains('Reference type', { timeout: pageLoadTimeout }).should('be.visible')
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic', {
      timeout: pageLoadTimeout,
    }).should('be.visible')
  })

  it('Time Unit works', () => {
    cy.visit('/time-unit')
    cy.location('pathname', { timeout: pageLoadTimeout }).should('eq', '/time-unit')
    cy.visit('/time-unit/bahean?tab=0')
    cy.contains('Bahean', { timeout: pageLoadTimeout }).should('be.visible')
  })
})
