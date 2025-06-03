before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Creating a species', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit('/species/new')
    cy.get('[id=subclass_or_superorder_name-textfield]').type('   testSuperOrder')
    cy.get('[id=order_name-textfield]').type('testOrder   ')
    cy.get('[id=suborder_or_superfamily_name-textfield]').type('test Super Family')
    cy.get('[id=family_name-textfield]').type('testFamily')
    cy.get('[id=subfamily_name-textfield]').type('testSubFamily')
    cy.get('[id=genus_name-textfield]').type('testGenus')
    cy.get('[id=species_name-textfield]').type('testSpecies')
    cy.get('[id=unique_identifier-textfield]').type('{backspace}testUniqueIdentifier')
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()

    // tests that values are capitalised and trimmed properly
    cy.contains('TestSuperOrder')
    cy.contains('TestOrder')
    cy.contains('Test Super Family')
    cy.contains('TestFamily')
    cy.contains('TestSubFamily')
    cy.contains('TestGenus')
    cy.contains('testspecies')
    cy.contains('testUniqueIdentifier')
  })

  it('with missing or invalid fields does not work', () => {
    cy.visit('/species/new')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('4 invalid fields')
  })
})

describe('Editing a species', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit('/species/21052/')
    cy.contains('21052 Simplomys simplicidens')
    cy.get('[id=edit-button]').click()

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
    cy.contains('ModifiedGenus')
    cy.contains('modifiedspecies')
    cy.contains('Subfamily or Tribe Heimo')
  })

  it('with missing required fields does not work', () => {
    cy.visit('/species/21052/')
    cy.contains('21052')
    cy.get('[id=edit-button]').click()

    cy.get('[id=genus_name-textfield]').clear()
    cy.contains('Genus: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('1 invalid field')

    cy.get('[id=species_name-textfield]').clear()
    cy.contains('Species: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('2 invalid fields')

    cy.get('[id=genus_name-textfield]').type('newGenus')
    cy.contains('Genus: This field is required').should('not.exist')
    cy.contains('Species: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('1 invalid field')

    cy.get('[id=species_name-textfield]').type('newSpecies')
    cy.contains('Species: This field is required').should('not.exist')
    cy.get('[id=write-button]').click()

    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()

    cy.contains('Saved species entry successfully.')
    cy.contains('NewGenus')
    cy.contains('newspecies')
  })
})

describe('Taxonomy checks work', () => {
  before('Reset database', () => {
    cy.request(Cypress.env('databaseResetUrl'))
  })

  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('Creating a species that already exists in database does not work', () => {
    cy.visit('/species/new')
    cy.get('[id=copy_existing_taxonomy_button]').contains('Copy existing taxonomy')
    cy.get('[id=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=detailview-button-21052]').click()
    cy.contains('Close').click()
    cy.get('[id=write-button]').click()
    cy.contains('The taxon already exists in the database.')
  })

  it('Invalid order/family pair does not work', () => {
    cy.visit('/species/new')
    cy.get('[id=copy_existing_taxonomy_button]').contains('Copy existing taxonomy')
    cy.get('[id=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=detailview-button-21052]').click()
    cy.contains('Close').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier') // change identifier so it's not a duplicate species
    cy.get('[id=order_name-textfield]').should('have.value', 'Rodentia')
    cy.get('[id=order_name-textfield]').clear()
    cy.get('[id=order_name-textfield]').type('Carnivora')
    cy.get('[id=write-button]').click()
    cy.contains('Family Gliridae belongs to order Rodentia, not Carnivora.')
  })

  it('Invalid family/genus pair does not work', () => {
    cy.visit('/species/new')
    cy.get('[id=copy_existing_taxonomy_button]').contains('Copy existing taxonomy')
    cy.get('[id=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=detailview-button-21052]').click()
    cy.contains('Close').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier')
    cy.get('[id=family_name-textfield]').should('have.value', 'Gliridae')
    cy.get('[id=family_name-textfield]').clear()
    cy.get('[id=family_name-textfield]').type('Soricidae')
    cy.get('[id=write-button]').click()
    cy.contains('Family Soricidae belongs to order Eulipotyphla, not Rodentia.')
    cy.contains('Genus Simplomys belongs to family Gliridae, not Soricidae.')
  })

  // TODO: these tests
  it.skip('Invalid superorder/order pair does not work')
  it.skip('Invalid order/suborder pair does not work')
  it.skip('Invalid suborder/family pair does not work')
  it.skip('Invalid family/subfamily pair does not work')
  it.skip('Invalid subfamily/genus pair does not work')

  it('When genus is indet. species has to be indet.', () => {
    cy.visit('/species/new')
    cy.get('[id=copy_existing_taxonomy_button]').contains('Copy existing taxonomy')
    cy.get('[id=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=detailview-button-21052]').click()
    cy.contains('Close').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier')
    cy.get('[id=genus_name-textfield]').clear()
    cy.get('[id=genus_name-textfield]').type('indet.')
    cy.contains('when the Genus is indet., Species must also be indet.')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=species_name-textfield]').clear()
    cy.get('[id=species_name-textfield]').type('indet.')
    cy.get('[id=write-button]').should('not.be.disabled')
  })

  it('When genus is gen. species has to be sp.', () => {
    cy.visit('/species/new')
    cy.get('[id=copy_existing_taxonomy_button]').contains('Copy existing taxonomy')
    cy.get('[id=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=detailview-button-21052]').click()
    cy.contains('Close').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier')
    cy.get('[id=genus_name-textfield]').clear()
    cy.get('[id=genus_name-textfield]').type('gen.')
    cy.contains('when the Genus is gen., Species must be sp.')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=species_name-textfield]').clear()
    cy.get('[id=species_name-textfield]').type('sp.')
    cy.get('[id=write-button]').should('not.be.disabled')
  })

  it('Order and Family must not contains spaces, unless they are incertae sedis', () => {
    cy.visit('/species/new')
    cy.get('[id=order_name-textfield]').type('test Order')
    cy.contains('​Order must not contain any spaces, unless the value is "incertae sedis".')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=order_name-textfield]').clear()
    cy.get('[id=order_name-textfield]').type('incertae sedis')

    cy.get('[id=family_name-textfield]').type('test Family')
    cy.contains('Family must not contain any spaces, unless the value is "incertae sedis".')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=family_name-textfield]').clear()
    cy.get('[id=family_name-textfield]').type('incertae sedis')

    cy.get('[id=genus_name-textfield]').type('testGenus')
    cy.get('[id=species_name-textfield]').type('testSpecies')
  })
})

describe('Deleting a species', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })
  // TODO: Add test for deleting a species (this can be copy pasted from other e2e test files with minimal changes)
  // Not done because species that have synonyms cannot be deleted currently.
})
