describe('Editing time unit', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })
  beforeEach('Reset database', () => {
    cy.request(Cypress.env('databaseResetUrl'))
  })

  it('User editing time unit with correct values succeeds', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=\\:r7\\:]').first().click()
    cy.get('[data-cy=detailview-button-ALMAAsianlandmammalage]').first().click()
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').click()
    cy.contains('ALMAAsianlandmammalage')
  })

  it('User editing time unit with incorrect bounds does not succeed and is notified about it', () => {
    cy.visit(`/time-unit/bahean?tab=0`)
    cy.contains('Bahean')
    cy.get('[id=edit-button]').click()
    cy.get('[id=\\:rb\\:]').click()
    cy.get('[data-cy=detailview-button-11]').first().click()
    cy.contains('​Upper bound age has to be lower than lower bound age')
    cy.contains('Lower bound age has to be higher than upper bound age')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').click()
    cy.contains('Bahean')
  })
})
