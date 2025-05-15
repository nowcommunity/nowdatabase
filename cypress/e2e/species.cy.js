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
    cy.contains('4 Invalid fields')
  })

  it.skip('that already exists in database does not work')
  it.skip('with invalid order/family pair does not work')
  it.skip('with invalid family/genus pair does not work')
  it.skip('when genus is indet. and species is not indet. does not work')
  it.skip('when genus is gen. and species is not sp. does not work')
})

describe('Using an existing species as a template works', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('Using the copy button fills taxonomy fields with data', () => {
    cy.visit('/species/new')
    // this is here to make sure cypress waits until the button has loaded
    cy.get('[id=copy_existing_taxonomy_button]').contains('Copy existing taxonomy')
    cy.get('[id=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=detailview-button-21052]').click()
    cy.contains('Close').click()
    cy.get('[id=subclass_or_superorder_name-textfield]').should('have.value', 'Eutheria')
    cy.get('[id=order_name-textfield]').should('have.value', 'Rodentia')
    cy.get('[id=suborder_or_superfamily_name-textfield]').should('have.value', '')
    cy.get('[id=family_name-textfield]').should('have.value', 'Gliridae')
    cy.get('[id=subfamily_name-textfield]').should('have.value', '')
    cy.get('[id=genus_name-textfield]').should('have.value', 'Simplomys')
    cy.get('[id=species_name-textfield]').should('have.value', 'simplicidens')
    cy.get('[id=write-button]').should('not.be.disabled')

    cy.get('[id=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=detailview-button-84357]').click()
    cy.contains('Close').click()
    cy.get('[id=subclass_or_superorder_name-textfield]').should('have.value', 'Eutheria')
    cy.get('[id=order_name-textfield]').should('have.value', 'Carnivora')
    cy.get('[id=suborder_or_superfamily_name-textfield]').should('have.value', 'Pinnipedia')
    cy.get('[id=family_name-textfield]').should('have.value', 'Odobenidae')
    cy.get('[id=subfamily_name-textfield]').should('have.value', '')
    cy.get('[id=genus_name-textfield]').should('have.value', 'Prototaria')
    cy.get('[id=species_name-textfield]').should('have.value', 'planicephala')
    cy.get('[id=write-button]').should('not.be.disabled')
  })
})

describe('Deleting a species', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })
  // TODO: Add test for deleting a species (this can be copy pasted from other e2e test files with minimal changes)
  // Not done because species that have synonyms cannot be deleted currently.
})
