describe('Editing time bound', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })
  beforeEach('Reset database', () => {
    cy.request(Cypress.env('databaseResetUrl'))
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
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('1.5')
  })

  it('with incorrect values does not work', () => {
    cy.visit(`/time-bound/11?tab=0`)
    cy.contains('C2N-y')
    cy.get('[id=edit-button]').click()
    cy.get('[id=age-textfield]').first().type('{backspace}{backspace}{backspace}{backspace}{backspace}')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('1 Invalid fields')
  })
})
