describe('Creating a species', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit('/species/new')
    cy.get('[id=order_name-textfield]').type('testOrder')
    cy.get('[id=family_name-textfield]').type('testFamily')
    cy.get('[id=genus_name-textfield]').type('testGenus')
    cy.get('[id=species_name-textfield]').type('testSpecies')
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').click()
    cy.contains('testOrder')
  })

  it('with missing required fields does not work', () => {
    cy.visit('/species/new')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
  })
})
