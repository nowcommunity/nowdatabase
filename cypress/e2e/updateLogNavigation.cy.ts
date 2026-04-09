/// <reference types="cypress" />

describe('Update log navigation', () => {
  before('Reset database', () => {
    cy.resetDatabase()
  })

  beforeEach('Login as admin', () => {
    cy.loginWithSession('testSu')
  })

  const openFirstUpdateWithReference = (index = 0) => {
    cy.get('[data-cy=update-details-button]').then($buttons => {
      expect(index, 'update row with references').to.be.lessThan($buttons.length)

      cy.wrap($buttons.eq(index)).click()

      cy.get('body').then($body => {
        if ($body.find('a[href^="/reference/"]').length > 0) return

        cy.contains('button', 'Close').click()
        openFirstUpdateWithReference(index + 1)
      })
    })
  }

  it('returns to the update log after viewing a reference detail', () => {
    cy.visit('/locality/21050?tab=11')
    cy.contains('Updates')

    openFirstUpdateWithReference()
    cy.contains('Update log')
    cy.contains('References')

    cy.get('a[href^="/reference/"]').first().click()

    cy.url().should('include', '/reference/')
    cy.contains('button', 'Return to table').should('be.visible').click()

    cy.url().should('include', '/locality/21050')
    cy.url().should('include', 'tab=10')
    cy.contains('Updates')
  })
})
