/// <reference types="cypress" />

describe('Update log navigation', () => {
  before('Reset database', () => {
    cy.request(Cypress.env('databaseResetUrl'))
  })

  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('returns to the update log after viewing a reference detail', () => {
    cy.visit('/locality/20920?tab=10')
    cy.contains('Updates')

    cy.get('[data-cy=update-details-button]').first().click()
    cy.contains('Update log')
    cy.contains('References')

    cy.contains('View').first().click()

    cy.url().should('include', '/reference/')
    cy.contains('button', 'Return to table').should('be.visible').click()

    cy.url().should('include', '/locality/20920')
    cy.url().should('include', 'tab=10')
    cy.contains('Updates')
  })
})
