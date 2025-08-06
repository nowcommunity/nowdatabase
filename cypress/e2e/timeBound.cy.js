before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Creating time bound', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with correct values works', () => {
    cy.visit(`/time-bound/new/`)
    cy.contains('Creating new time-bound')
    cy.contains('Name: This field is required')
    cy.contains('Age (Ma): This field is required')
    cy.get('[id=b_name-textfield]').first().type('test bound')
    cy.contains('Name: This field is required').should('not.exist')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=age-textfield]').first().type('20')
    cy.contains('Age (Ma): This field is required').should('not.exist')
    cy.get('[id=write-button]').click()
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="add-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('Edited item successfully.')
  })
})

describe('Editing time bound', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with correct values works', () => {
    cy.visit(`/time-bound/11?tab=0`)
    cy.contains('C2N-y')
    cy.get('[id=edit-button]').click()
    cy.get('[id=age-textfield]').first().type('{backspace}{backspace}{backspace}{backspace}{backspace}1.5')
    cy.contains('This field is required').should('not.exist')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="add-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('Edited item successfully.')
    cy.contains('1.5')
  })

  it('with incorrect values does not work', () => {
    cy.visit(`/time-bound/11?tab=0`)
    cy.contains('C2N-y')
    cy.get('[id=edit-button]').click()
    cy.get('[id=age-textfield]').first().type('{backspace}{backspace}{backspace}{backspace}{backspace}')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('1 invalid field')
  })
})

describe('Deleting a time bound', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  // TODO: Add test for deleting a time bound (this can be copy pasted from other e2e test files with minimal changes)
  // Not done because time bounds that have linked time units cannot be deleted currently.
})
