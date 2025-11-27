/// <reference types="cypress" />

const REGION_NAME = `Delete Flow Region ${Date.now()}`

describe('Delete flow', () => {
  before('Wait for database and reset', () => {
    cy.task('waitForDbHealthy')
    cy.request(Cypress.env('databaseResetUrl'))
  })

  beforeEach('Login as delete-capable coordinator', () => {
    cy.loginAsDeleteCoordinator()
  })

  it('deletes a region and removes it from the table', () => {
    cy.deleteTargets().then((targets: DeleteTarget[]) => {
      const regionTarget = targets.find(target => target.entity === 'Region')
      if (!regionTarget) {
        throw new Error('Region delete target metadata is missing')
      }

      cy.visit('/region/new')
      cy.contains('Creating new region')
      cy.contains('Region: This field is required')
      cy.get('[id=region-textfield]').type(REGION_NAME)
      cy.get('[id=write-button]').should('not.be.disabled').click()

      cy.contains(REGION_NAME)
      cy.get(regionTarget.deleteButton).should('exist')

      cy.url().should('match', /\/region\/\d+$/)
      cy.url().then(url => {
        const createdId = url.split('/').pop()
        expect(createdId, 'created region id').to.match(/\d+/)

        cy.intercept('DELETE', `**/region/${createdId}`).as('deleteRegion')

        cy.on('window:confirm', message => {
          expect(message).to.eq(regionTarget.confirmText)
          return true
        })

        cy.get(regionTarget.deleteButton).click()

        cy.wait('@deleteRegion').its('response.statusCode').should('be.oneOf', [200])

        cy.contains('Deleted item successfully.').should('be.visible')

        cy.url().should('include', '/region')
        cy.contains(REGION_NAME).should('not.exist')

        cy.visit(`/region/${createdId}`)
        cy.contains('Error loading data')
      })
    })
  })
})
