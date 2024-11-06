describe('Species validators work', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('Creating a species with missing required fields does not work', () => {
    cy.visit('/species/new')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
  })

  it.skip('Creating a species with valid data works', () => {
    cy.visit('/species/new')
    cy.get('[id=order]').type('testOrder')
    cy.get('[id=family]').type('testFamily')
    cy.get('[id=genus]').type('testGenus')
    cy.get('[id=species]').type('testSpecies')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').click()
    cy.contains('testOrder')
  })
})
