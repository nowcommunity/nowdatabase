before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

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
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('testOrder')
    // TODO: check that all fields are properly capitalised or lowercased after creating species
  })

  it('with missing required fields does not work', () => {
    cy.visit('/species/new')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('4 invalid fields')
  })

  it.skip('that already exists in database does not work')
  it.skip('with invalid order/family pair does not work')
  it.skip('with invalid family/genus pair does not work')
  it.skip('when genus is indet. and species is not indet. does not work')
  it.skip('when genus is gen. and species is not sp. does not work')
})

describe('Editing a species', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit('/species/21052/')
    cy.contains('21052 Simplomys simplicidens')
    cy.get('[id=edit-button]').click()

    cy.get('[id=order_name-textfield]').clear()
    cy.get('[id=order_name-textfield]').type('modifiedOrder')
    cy.get('[id=family_name-textfield]').clear()
    cy.get('[id=family_name-textfield]').type('modifiedFamily')
    cy.get('[id=genus_name-textfield]').clear()
    cy.get('[id=genus_name-textfield]').type('modifiedGenus')
    cy.get('[id=species_name-textfield]').clear()
    cy.get('[id=species_name-textfield]').type('modifiedSpecies')
    cy.get('[id=subfamily_name-textfield]').type('heimo')

    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('Saved species entry successfully.')
    cy.contains('modifiedOrder')
    cy.contains('Subfamily or Tribe heimo')
  })

  it('with missing required fields does not work', () => {
    cy.visit('/species/21052/')
    cy.contains('21052')
    cy.get('[id=edit-button]').click()

    cy.get('[id=order_name-textfield]').clear()
    cy.contains('Order: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('1 invalid field')

    cy.get('[id=family_name-textfield]').clear()
    cy.contains('Family: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('2 invalid fields')

    cy.get('[id=order_name-textfield]').type('newOrder')
    cy.contains('Order: This field is required').should('not.exist')
    cy.contains('Family: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('1 invalid field')

    cy.get('[id=family_name-textfield]').type('newFamily')
    cy.contains('Family: This field is required').should('not.exist')
    cy.get('[id=write-button]').click()

    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()

    cy.contains('Saved species entry successfully.')
    cy.contains('newOrder')
    cy.contains('newFamily')
    cy.contains('modifiedGenus')
    cy.contains('Subfamily or Tribe heimo')
  })
})

describe('Deleting a species', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })
  // TODO: Add test for deleting a species (this can be copy pasted from other e2e test files with minimal changes)
  // Not done because species that have synonyms cannot be deleted currently.
})
