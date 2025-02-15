before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Creating a time unit', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with correct values works', () => {
    cy.visit(`/time-unit/new`)
    cy.get('[id=tu_display_name-textfield]').type('Testing Time Unit Creation')
    cy.get('[id=sequence-tableselection]').first().click() // sequence field
    cy.get('[data-cy=detailview-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=up_bnd-tableselection]').first().click() // New Upper Bound Id field
    cy.get('[data-cy=detailview-button-11]').first().click()
    cy.get('[id=low_bnd-tableselection]').first().click() // New Lower Bound Id field
    cy.get('[data-cy=detailview-button-14]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('Testing Time Unit Creation')
    cy.contains('ALMAAsianlandmammalage')
    cy.contains('C2N-o')
    cy.contains('C2N-y')
  })

  it('without bounds does not work', () => {
    cy.visit(`/time-unit/new`)
    cy.get('[id=tu_display_name-textfield]').type('Testing Time Unit Creation')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-ALMAAsianlandmammalage]').first().click()
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('2 Invalid fields')
  })

  it('but returning from staging view before saving works', () => {
    cy.visit(`/time-unit/new`)
    cy.get('[id=tu_display_name-textfield]').type('Testing Time Unit Creation part 2')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=up_bnd-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-11]').first().click()
    cy.get('[id=low_bnd-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-14]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=return-to-editing-button]').click()
    cy.contains('Creating new time-unit')
    cy.get('[id=tu_display_name-textfield]').should('not.be.disabled')
    cy.get('[id=tu_display_name-textfield]').should('have.value', 'Testing Time Unit Creation part 2')
    cy.get('[id=sequence-tableselection]').should('have.value', 'ALMAAsianlandmammalage')
    cy.get('[id=up_bnd-tableselection]').should('have.value', '11')
    cy.get('[id=low_bnd-tableselection]').should('have.value', '14')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('C2N-o')
    cy.contains('C2N-y')
    cy.contains('Creating new time-unit').should('not.exist')
  })

  it('and editing after saving works', () => {
    cy.visit(`/time-unit/new`)
    cy.get('[id=tu_display_name-textfield]').type('Testing Time Unit Creation part 3')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=up_bnd-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-11]').first().click()
    cy.get('[id=low_bnd-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-14]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('C2N-o')
    cy.contains('C2N-y')
    cy.get('[id=edit-button]').click()
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-CalatayudTeruellocalbiozone]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('CalatayudTeruellocalbiozone')
  })
})

describe('Editing a time unit', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with correct values works', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=tu_display_name-textfield]').should('be.disabled') // name field is disabled when editing
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('ALMAAsianlandmammalage')
  })

  it('with incorrect bounds does not work', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=low_bnd-tableselection]').click()
    cy.get('[data-cy=detailview-button-11]').first().click()
    cy.contains('​Upper bound age has to be lower than lower bound age')
    cy.contains('Lower bound age has to be higher than upper bound age')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('2 Invalid fields')
  })

  it('but returning from staging view before saving works', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-CalatayudTeruellocalbiozone]').first().click()
    cy.get('[id=up_bnd-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-11]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=return-to-editing-button]').click()
    cy.contains('Bahean')
    cy.get('[id=tu_display_name-textfield]').should('be.disabled')
    cy.get('[id=tu_display_name-textfield]').should('have.value', 'Bahean')
    cy.get('[id=sequence-tableselection]').should('have.value', 'CalatayudTeruellocalbiozone')
    cy.get('[id=up_bnd-tableselection]').should('have.value', '11')
    cy.get('[id=low_bnd-tableselection]').should('have.value', '20213')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('CalatayudTeruellocalbiozone')
    cy.contains('MioceneLate-low')
    cy.contains('C2N-y')
  })

  it('and editing again after saving works', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-easternparatethys]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=tu_display_name-textfield]').should('be.disabled')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=detailview-button-CalatayudTeruellocalbiozone]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('Bahean')
    cy.contains('CalatayudTeruellocalbiozone')
  })
})
