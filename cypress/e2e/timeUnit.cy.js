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
    cy.get('[data-cy=add-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=up_bnd-tableselection]').first().click() // Select Upper Bound Button
    cy.get('[data-cy=add-button-11]').first().click()
    cy.get('[id=low_bnd-tableselection]').first().click() // Select Lower Bound Button
    cy.get('[data-cy=add-button-14]').first().click()

    cy.addReferenceAndSave()
    cy.contains('Testing Time Unit Creation')
    cy.contains('ALMAAsianlandmammalage')
    cy.contains('C2N-o')
    cy.contains('C2N-y')
    cy.contains('Creating new time-unit').should('not.exist')
  })

  it('without bounds does not work', () => {
    cy.visit(`/time-unit/new`)
    cy.get('[id=tu_display_name-textfield]').type('Testing Time Unit Creation')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=add-button-ALMAAsianlandmammalage]').first().click()
    cy.contains('Upper Bound: This field is required')
    cy.contains('Lower Bound: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
  })

  it('with incorrect, newly created bounds does not work', () => {
    cy.visit(`/time-unit/new`)
    cy.get('[id=tu_display_name-textfield]').type('Testing Time Unit Creation')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=add-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=low_bnd-tableselection]').click()
    cy.get('[data-cy=add-button-11]').first().click()

    cy.get('[data-cy=add-new-up-bound-form]').click()
    cy.get('[name=b_name]').type('new upper time bound name')
    cy.get('[name=b_comment]').type('test comment')

    cy.get('[name=age]').type('one')
    cy.contains('Save').click()
    cy.contains('Value must be a valid number')

    cy.get('[name=age]').clear()
    cy.get('[name=age]').type('-2')
    cy.contains('Save').click()
    cy.contains('Value must be a valid number')

    cy.get('[name=age]').clear()
    cy.get('[name=age]').type('0123')
    cy.contains('Save').click()
    cy.contains('Value must be a valid number')

    cy.get('[name=age]').clear()
    cy.get('[name=age]').type('0,5')
    cy.contains('Save').click()
    cy.contains('Value must be a valid number')

    cy.get('[name=age]').clear()
    cy.get('[name=age]').type('1')
    cy.contains('Save').click()
    cy.contains('Value must be a valid number').should('not.exist')

    cy.get('[id=write-button]').should('not.be.disabled')

    cy.get('[data-cy=add-new-low-bound-form]').click()
    cy.get('[name=b_name]').type('new lower time bound name')
    cy.get('[name=b_comment]').type('test comment')
    cy.get('[name=age]').type('0.5')
    cy.contains('Save').click()

    cy.contains('Upper Bound: Upper bound age has to be lower than lower bound age')
    cy.contains('Lower Bound: Lower bound age has to be higher than upper bound age')
    cy.get('[id=write-button]').should('be.disabled')
  })

  it('with incorrect, existing bounds does not work', () => {
    cy.visit(`/time-unit/new`)
    cy.get('[id=tu_display_name-textfield]').type('Testing Time Unit Creation')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=add-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=up_bnd-tableselection]').click()
    cy.get('[data-cy=add-button-14]').first().click()
    cy.get('[id=low_bnd-tableselection]').click()
    cy.get('[data-cy=add-button-11]').first().click()
    cy.contains('Upper Bound: Upper bound age has to be lower than lower bound age')
    cy.contains('Lower Bound: Lower bound age has to be higher than upper bound age')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[id=up_bnd-tableselection]').click()
    cy.get('[data-cy=add-button-11]').first().click()
    cy.contains('Upper Bound: Upper bound age cannot be the same as lower bound age')
    cy.contains('Lower Bound: Lower bound age cannot be the same as upper bound age')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[id=low_bnd-tableselection]').click()
    cy.get('[data-cy=add-button-14]').first().click()
    cy.get('[id=write-button]').should('not.be.disabled')
  })

  it('but returning from staging view before saving works', () => {
    cy.visit(`/time-unit/new`)
    cy.get('[id=tu_display_name-textfield]').type('Testing Time Unit Creation')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=add-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=up_bnd-tableselection]').first().click()
    cy.get('[data-cy=add-button-11]').first().click()
    cy.get('[id=low_bnd-tableselection]').first().click()
    cy.get('[data-cy=add-button-14]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=return-to-editing-button]').click()
    cy.contains('Creating new time-unit')
    cy.get('[id=tu_display_name-textfield]').should('not.be.disabled')
    cy.get('[id=tu_display_name-textfield]').should('have.value', 'Testing Time Unit Creation')
    cy.get('[id=sequence-tableselection]').should('have.value', 'ALMAAsianlandmammalage')
    cy.contains('C2N-o')
    cy.contains('C2N-y')

    cy.addReferenceAndSave()
    cy.contains('C2N-o')
    cy.contains('C2N-y')
    cy.contains('Creating new time-unit').should('not.exist')
  })

  it('and editing after saving works', () => {
    cy.visit(`/time-unit/new`)
    cy.get('[id=tu_display_name-textfield]').type('Testing Time Unit Creation part 3')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=add-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=up_bnd-tableselection]').first().click()
    cy.get('[data-cy=add-button-11]').first().click()
    cy.get('[id=low_bnd-tableselection]').first().click()
    cy.get('[data-cy=add-button-14]').first().click()

    cy.addReferenceAndSave()
    cy.contains('C2N-o')
    cy.contains('C2N-y')
    cy.get('[id=edit-button]').click()
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=add-button-CalatayudTeruellocalbiozone]').first().click()
    cy.get('[id=low_bnd-tableselection]').first().click()
    cy.get('[data-cy=add-button-49]').first().click()

    cy.addReferenceAndSave()
    cy.contains('CalatayudTeruellocalbiozone')
    cy.contains('Langhian/Serravallian')
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
    cy.get('[data-cy=add-button-ALMAAsianlandmammalage]').first().click()

    cy.addReferenceAndSave()
    cy.contains('ALMAAsianlandmammalage')
  })

  it('with incorrect, newly created bounds does not work', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.get('[id=edit-button]').click()
    cy.contains('7.2') // existing upper bound age
    cy.contains('11.63') // existing lower bound age

    cy.get('[data-cy=add-new-up-bound-form]').click()
    cy.get('[name=b_name]').type('new upper time bound name')
    cy.get('[name=b_comment]').type('test comment')
    cy.get('[name=age]').type('12')
    cy.contains('Save').click()
    cy.contains('Upper Bound: Upper bound age has to be lower than lower bound age')
    cy.contains('Lower Bound: Lower bound age has to be higher than upper bound age')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[data-cy=add-new-up-bound-form]').click()
    cy.get('[name=age]').clear()
    cy.get('[name=age]').type('11.02')
    cy.contains('Save').click()
    cy.get('[id=write-button]').should('not.be.disabled')

    cy.get('[data-cy=add-new-low-bound-form]').click()
    cy.get('[name=b_name]').type('new lower time bound name')
    cy.get('[name=b_comment]').type('test comment')
    cy.get('[name=age]').type('0.5')
    cy.contains('Save').click()

    cy.contains('Upper Bound: Upper bound age has to be lower than lower bound age')
    cy.contains('Lower Bound: Lower bound age has to be higher than upper bound age')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[data-cy=add-new-low-bound-form]').click()
    cy.get('[name=age]').clear()
    cy.get('[name=age]').type('15.55')
    cy.contains('Save').click()
    cy.get('[id=write-button]').should('not.be.disabled')
  })

  it('with incorrect, existing bounds does not work', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=low_bnd-tableselection]').click()
    cy.get('[data-cy=add-button-11]').first().click()
    cy.contains('Upper Bound: Upper bound age has to be lower than lower bound age')
    cy.contains('Lower Bound: Lower bound age has to be higher than upper bound age')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[id=up_bnd-tableselection]').click()
    cy.get('[data-cy=add-button-11]').first().click()
    cy.contains('Upper Bound: Upper bound age cannot be the same as lower bound age')
    cy.contains('Lower Bound: Lower bound age cannot be the same as upper bound age')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[id=low_bnd-tableselection]').click()
    cy.get('[data-cy=add-button-14]').first().click()
    cy.get('[id=write-button]').should('not.be.disabled')
  })

  it('but returning from staging view before saving works', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=add-button-CalatayudTeruellocalbiozone]').first().click()
    cy.get('[id=up_bnd-tableselection]').first().click()
    cy.get('[data-cy=add-button-11]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=return-to-editing-button]').click()
    cy.contains('Bahean')
    cy.get('[id=tu_display_name-textfield]').should('be.disabled')
    cy.get('[id=tu_display_name-textfield]').should('have.value', 'Bahean')
    cy.get('[id=sequence-tableselection]').should('have.value', 'CalatayudTeruellocalbiozone')
    cy.contains('C2N-y')
    cy.contains('MioceneLate-low')

    cy.addReferenceAndSave()
    cy.contains('CalatayudTeruellocalbiozone')
    cy.contains('C2N-y')
    cy.contains('MioceneLate-low')
  })

  it('and editing again after saving works', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=add-button-easternparatethys]').first().click()

    cy.addReferenceAndSave()
    cy.contains('Bahean')
    cy.contains('easternparatethys')
    cy.get('[id=edit-button]').click()
    cy.get('[id=tu_display_name-textfield]').should('be.disabled')
    cy.get('[id=sequence-tableselection]').first().click()
    cy.get('[data-cy=add-button-CalatayudTeruellocalbiozone]').first().click()
    cy.get('[id=up_bnd-tableselection]').first().click()
    cy.get('[data-cy=add-button-14]').first().click()

    cy.addReferenceAndSave()
    cy.contains('CalatayudTeruellocalbiozone')
    cy.contains('C2N-o')
  })
})

describe('Deleting a time unit', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  // TODO: Add test for deleting a time unit (this can be copy pasted from other e2e test files with minimal changes)
  // Not done because time units that have linked localities cannot be deleted currently.
})
