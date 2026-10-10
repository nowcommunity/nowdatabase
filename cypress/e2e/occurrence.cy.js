before('Reset database', () => {
  cy.resetDatabase()
})

describe('Occurrence editing', () => {
  beforeEach('Login as admin with session caching', () => {
    cy.loginWithSession('testSu')
  })
  it('allows admin to open edit mode and finalize flow', () => {
    cy.visit('/occurrence/21050/85729')

    cy.get('#edit-button').should('exist').click()
    cy.get('#write-button').should('contain.text', 'Finalize entry')

    cy.get('[id=source_name-textfield]').clear()
    cy.get('[id=source_name-textfield]').type('Occurrence E2E source')
    cy.get('#write-button').should('not.be.disabled').click()

    cy.get('#write-button').should('contain.text', 'Complete and save')
    cy.contains('Add existing reference').should('be.visible')
  })

  it('works with some changed values in all tabs', () => {
    cy.resetDatabase()
    cy.visit('/occurrence/21050/85729')

    cy.get('#edit-button').click()
    cy.get('[id=source_name-textfield]').clear()
    cy.get('[id=source_name-textfield]').type('Test value')

    cy.get('[role=tablist]').contains('Wear').click()
    cy.get('[id=mw_scale_min-textfield]').clear()
    cy.get('[id=mw_scale_min-textfield]').type('1')
    cy.get('[id=mw_scale_max-textfield]').clear()
    cy.get('[id=mw_scale_max-textfield]').type('10')
    cy.get('[id=mw_value-textfield]').clear()
    cy.get('[id=mw_value-textfield]').type('5')

    cy.get('[role=tablist]').contains('Isotopes').click()
    cy.get('[id=dc13_mean-textfield]').clear()
    cy.get('[id=dc13_mean-textfield]').type('12.5')
    cy.get('[id=dc13_n-textfield]').clear()
    cy.get('[id=dc13_n-textfield]').type('2')
    cy.get('[id=do18_mean-textfield]').clear()
    cy.get('[id=do18_mean-textfield]').type('18.5')
    cy.get('[id=do18_n-textfield]').clear()
    cy.get('[id=do18_n-textfield]').type('3')

    cy.addReferenceAndSave()
    cy.url().should('include', '/occurrence/21050/85729')

    cy.get('#edit-button').click()
    cy.get('[role=tablist]').contains('Occurrence').click()
    cy.get('[id=source_name-textfield]').should('have.value', 'Test value')
    cy.get('[role=tablist]').contains('Wear').click()
    cy.get('[id=mw_scale_min-textfield]').should('have.value', '1')
    cy.get('[id=mw_scale_max-textfield]').should('have.value', '10')
    cy.get('[id=mw_value-textfield]').should('have.value', '5')
    cy.get('[role=tablist]').contains('Isotopes').click()
    cy.get('[id=dc13_mean-textfield]').should('have.value', '12.5')
    cy.get('[id=dc13_n-textfield]').should('have.value', '2')
    cy.get('[id=do18_mean-textfield]').should('have.value', '18.5')
    cy.get('[id=do18_n-textfield]').should('have.value', '3')
  })

  it('works with species changed to an existing species', () => {
    cy.resetDatabase()
    cy.visit('/occurrence/21050/85729')

    cy.get('#edit-button').click()
    cy.contains('Select Species').click()
    cy.get('[data-cy=table-row-21052]').click()
    cy.contains('simplicidens').should('be.visible')

    cy.addReferenceAndSave()

    cy.url().should('include', '/occurrence/21050/21052')
    cy.contains('simplicidens').should('be.visible')

    cy.visit('/species/21052')
    cy.get('[role=tablist]').contains('Occurrences').click()
    cy.contains('Dmanisi')
  })

  it('works with species changed to a new species', () => {
    const speciesName = `occurrencespecies${Date.now()}`

    cy.resetDatabase()
    cy.loginWithSession('testSu')
    cy.visit('/occurrence/21050/85729')

    cy.get('#edit-button').click()
    cy.contains('Add new Species').click()
    cy.get('[name=order_name]').type('OccurrenceOrder')
    cy.get('[name=family_name]').type('OccurrenceFamily')
    cy.get('[name=genus_name]').type('OccurrenceGenus')
    cy.get('[name=species_name]').type(speciesName)
    cy.get('[id=editing-modal-save-button]').click()

    cy.addReferenceAndSave()

    // Main Occurrence table should be visible, since creating a new Species inside an Occurrence navigates there
    cy.url().should('include', '/occurrence')
    cy.contains(speciesName).click()
    cy.url().should('include', '/occurrence/21050')
    cy.contains('Dmanisi')
    cy.contains(speciesName)

    // go to the newly created species details
    cy.url().then(url => cy.visit(`species/${url.split('/')[5]}`))
    cy.contains(speciesName)
    cy.get('[role=tablist]').contains('Occurrences').click()
    cy.contains('Dmanisi')
  })

  // TODO: create these once update log for Occurrences works correctly, see GitHub issue
  it.skip('shows update logs correctly with changed basic values')
  it.skip('shows update logs correctly with changed, but existing species')
  it.skip('shows update logs correctly with a new species')

  it('prevents read-only user from editing occurrence', () => {
    cy.loginWithSession('testEu')
    cy.visit('/occurrence/21050/85729')

    cy.get('#edit-button').should('not.exist')
    cy.get('#write-button').should('not.exist')
  })
})
