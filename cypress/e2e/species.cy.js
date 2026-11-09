before('Reset database once for all tests', () => {
  cy.resetDatabase()
})

describe('Creating a species', () => {
  beforeEach('Login as admin with session caching', () => {
    cy.loginWithSession('testSu')
  })

  it('with valid data works and is formatted properly', () => {
    cy.visit('/species/new')
    // spaces should be automatically removed
    cy.get('[id=subclass_or_superorder_name-textfield]').type('   testSuperOrder')
    cy.get('[id=order_name-textfield]').type('testOrder   ')
    cy.get('[id=suborder_or_superfamily_name-textfield]').type('testSuperFamily')
    cy.get('[id=family_name-textfield]').type('incertae sedis')
    cy.get('[id=subfamily_name-textfield]').type('testSubFamily')
    cy.get('[id=genus_name-textfield]').type('testGenus')
    cy.get('[id=species_name-textfield]').type('testSpecies')
    cy.get('[id=unique_identifier-textfield]').type('{backspace}testUniqueIdentifier')
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.addReferenceAndSave()

    // tests that values are capitalised and trimmed properly
    cy.contains('Testsuperorder')
    cy.contains('Testorder')
    cy.contains('Testsuperfamily')
    cy.contains('incertae sedis')
    cy.contains('Testsubfamily')
    cy.contains('Testgenus')
    cy.contains('testspecies')
    cy.contains('testUniqueIdentifier')
  })

  it('with missing or invalid fields does not work', () => {
    cy.visit('/species/new')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('4 invalid fields')
  })

  // TODO: check that validators for mistyped special values work, once they are implemented
  // e.g. typing "incertaesedis" in a taxonomy field should prompt the user to input "incertae sedis" instead
})

describe('Editing a species', () => {
  beforeEach('Login as admin with session caching', () => {
    cy.loginWithSession('testSu')
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
    cy.addReferenceAndSave()
    cy.contains('Saved species entry successfully.')
    cy.contains('Modifiedgenus')
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

    cy.addReferenceAndSave()
    cy.contains('Saved species entry successfully.')
    cy.contains('Newgenus')
    cy.contains('newspecies')
  })
})

describe('Taxonomy checks work', () => {
  const acknowledgeTaxonomyMismatchIfShown = () => {
    cy.get('body').then($body => {
      if ($body.text().includes('I understand and want to continue.')) {
        cy.contains('I understand and want to continue.').click()
      }
    })
  }

  const acknowledgeTaxonomyMismatchAndSave = (...expectedMessages) => {
    expectedMessages.forEach(message => cy.contains(message).should('be.visible'))
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('I understand and want to continue.').click()
    cy.get('[id=write-button]').should('not.be.disabled')

    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('contain.text', 'Complete and save')
    cy.get('[id=write-button]').then($button => {
      if ($button.is(':disabled')) {
        cy.contains('button', 'Add existing reference').click()
        cy.get('button[data-cy^="add-button"]').first().click()
        cy.contains('button', 'Close').click()
      }
    })
    cy.get('[id=write-button]').should('not.be.disabled').click()
    cy.contains('Saved species entry successfully.')
  }

  beforeEach('Reset database', () => {
    cy.resetDatabase()
  })

  beforeEach('Login as admin with session caching', () => {
    cy.loginWithSession('testSu')
  })

  it('Creating a species that already exists in database does not work', () => {
    cy.visit('/species/new')
    cy.get('[data-cy=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=add-button-21052]').click()
    cy.get('[id=write-button]').click()
    cy.contains('The taxon already exists in the database.')
  })

  it('allows admins to add a species with invalid main taxonomy values after acknowledgement', () => {
    cy.visit('/species/new')
    cy.get('[data-cy=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=add-button-21052]').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier main') // change identifier so it's not a duplicate species
    cy.get('[id=order_name-textfield]').should('have.value', 'Rodentia')
    cy.get('[id=order_name-textfield]').clear()
    cy.get('[id=order_name-textfield]').type('Carnivora')
    cy.get('[id=family_name-textfield]').should('have.value', 'Gliridae')
    cy.get('[id=family_name-textfield]').clear()
    cy.get('[id=family_name-textfield]').type('Soricidae')
    acknowledgeTaxonomyMismatchAndSave(
      'Family Soricidae belongs to order Eulipotyphla, not Carnivora.',
      'Genus Simplomys belongs to family Gliridae, not Soricidae.'
    )
  })

  // TODO
  // it.skip('Creating a species whose family is included in multiple existing suborders does not work')
  // it.skip('Editing a species whose family is included in multiple existing suborders does not work')

  it('allows admins to add a species with an invalid superorder/order pair after acknowledgement', () => {
    cy.visit('/species/new')
    cy.get('[data-cy=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=add-button-21052]').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier superorder')
    cy.get('[id=subclass_or_superorder_name-textfield]').should('have.value', 'Eutheria')
    cy.get('[id=subclass_or_superorder_name-textfield]').clear()
    cy.get('[id=subclass_or_superorder_name-textfield]').type('somethingelse')
    acknowledgeTaxonomyMismatchAndSave('Order Rodentia belongs to subclass Eutheria, not Somethingelse.')
  })

  it('allows admins to add a species with an invalid order/suborder/family trio after acknowledgement', () => {
    cy.visit('/species/new')
    cy.get('[data-cy=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=add-button-84357]').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier suborder trio')
    cy.get('[id=order_name-textfield]').should('have.value', 'Carnivora')
    cy.get('[id=order_name-textfield]').clear()
    cy.get('[id=order_name-textfield]').type('Rodentia')
    acknowledgeTaxonomyMismatchAndSave(
      'Suborder Pinnipedia belongs to order Carnivora, not Rodentia.',
      'Family Odobenidae belongs to order Carnivora, not Rodentia.'
    )
  })

  it('allows admins to add a species with an invalid suborder/family pair after acknowledgement', () => {
    cy.visit('/species/new')
    cy.get('[data-cy=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=add-button-84357]').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier suborder pair')
    cy.get('[id=suborder_or_superfamily_name-textfield]').should('have.value', 'Pinnipedia')
    cy.get('[id=suborder_or_superfamily_name-textfield]').clear()
    cy.get('[id=suborder_or_superfamily_name-textfield]').type('somethingelse')
    acknowledgeTaxonomyMismatchAndSave('Family Odobenidae belongs to suborder Pinnipedia, not Somethingelse.')
  })

  it('allows admins to add a species with an invalid family/subfamily/genus trio after acknowledgement', () => {
    cy.visit('/species/new')
    cy.get('[data-cy=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=add-button-23065]').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier family trio')
    cy.get('[id=family_name-textfield]').should('have.value', 'Soricidae')
    cy.get('[id=family_name-textfield]').clear()
    cy.get('[id=family_name-textfield]').type('Gliridae')
    acknowledgeTaxonomyMismatchAndSave(
      'Subfamily Soricinae belongs to family Soricidae, not Gliridae.',
      'Genus Petenyia belongs to family Soricidae, not Gliridae.'
    )
  })

  it('allows admins to add a species with an invalid subfamily/genus pair after acknowledgement', () => {
    cy.visit('/species/new')
    cy.get('[data-cy=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=add-button-23065]').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier subfamily')
    cy.get('[id=subfamily_name-textfield]').should('have.value', 'Soricinae')
    cy.get('[id=subfamily_name-textfield]').clear()
    cy.get('[id=subfamily_name-textfield]').type('somethingelse')
    acknowledgeTaxonomyMismatchAndSave('Genus Petenyia belongs to subfamily Soricinae, not Somethingelse.')
  })

  it('When genus is indet. species has to be indet.', () => {
    cy.visit('/species/new')
    cy.get('[data-cy=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=add-button-21052]').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier')
    cy.get('[id=genus_name-textfield]').clear()
    cy.get('[id=genus_name-textfield]').type('indet.')
    cy.contains('when the Genus is indet., Species must also be indet.')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=species_name-textfield]').clear()
    cy.get('[id=species_name-textfield]').type('indet.')
    acknowledgeTaxonomyMismatchIfShown()
    cy.get('[id=write-button]').should('not.be.disabled')
  })

  it('When genus is gen. species has to be sp.', () => {
    cy.visit('/species/new')
    cy.get('[data-cy=copy_existing_taxonomy_button]').click()
    cy.get('[data-cy=add-button-21052]').click()
    cy.get('[id=unique_identifier-textfield]').type('{backspace}new identifier')
    cy.get('[id=genus_name-textfield]').clear()
    cy.get('[id=genus_name-textfield]').type('gen.')
    cy.contains('when the Genus is gen., Species must be sp.')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=species_name-textfield]').clear()
    cy.get('[id=species_name-textfield]').type('sp.')
    acknowledgeTaxonomyMismatchIfShown()
    cy.get('[id=write-button]').should('not.be.disabled')
  })

  it('Order and Family must not contains spaces, unless they are incertae sedis', () => {
    cy.visit('/species/new')
    cy.get('[id=genus_name-textfield]').type('testGenus')
    cy.get('[id=species_name-textfield]').type('testSpecies')
    cy.get('[id=family_name-textfield]').type('testFamily')

    cy.get('[id=order_name-textfield]').type('test Order')
    cy.contains('​Order must not contain any spaces, unless the value is "incertae sedis".')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=order_name-textfield]').clear()
    cy.get('[id=order_name-textfield]').type('incertae sedis')
    cy.get('[id=write-button]').should('not.be.disabled')

    cy.get('[id=family_name-textfield]').clear()
    cy.get('[id=family_name-textfield]').type('test Family')
    cy.contains('Family must not contain any spaces, unless the value is "incertae sedis".')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=family_name-textfield]').clear()
    cy.get('[id=family_name-textfield]').type('incertae sedis')
    cy.get('[id=write-button]').should('not.be.disabled')
  })
})

describe('Deleting a species', () => {
  beforeEach('Login as admin with session caching', () => {
    cy.loginWithSession('testSu')
  })
  // TODO: Add test for deleting a species (this can be copy pasted from other e2e test files with minimal changes)
  // Not done because species that have synonyms cannot be deleted currently.
})
