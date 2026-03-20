/// <reference types="cypress" />

describe('Sequence edit behavior', () => {
  beforeEach('Reset database and login as admin', () => {
    cy.resetDatabase()
    cy.login('testSu')
  })

  it('shows display labels in edit mode and keeps them after saving', () => {
    cy.visit('/time-unit/bahean?tab=0')
    cy.contains('Bahean')

    cy.get('[id=edit-button]').click()
    cy.get('[id=sequence-tableselection]').should('have.value', 'ChLMA')
    cy.contains('button', 'Cancel').click()
    cy.get('[id=edit-button]').click()
    cy.get('[id=sequence-tableselection]').should('have.value', 'ChLMA')
  })
})
