/// <reference types="cypress" />

const regionName = (label: string) => `Delete Flow Region ${label} ${Date.now()}`

const createRegion = (regionTarget: DeleteTarget, name: string) => {
  cy.visit('/region/new')
  cy.contains('Creating new region')
  cy.contains('Region: This field is required')
  cy.get('[id=region-textfield]').type(name)
  cy.get('[id=write-button]').should('not.be.disabled').click()

  cy.contains(name)
  cy.get(regionTarget.deleteButton).should('exist')

  return cy.url().then(url => {
    const createdId = url.split('/').pop()
    expect(createdId, 'created region id').to.match(/\d+/)
    return createdId!
  })
}

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

      const name = regionName('Success')

      cy.wrap(null).then(() => createRegion(regionTarget, name)).then(createdId => {
        cy.intercept('DELETE', `**/region/${createdId}`).as('deleteRegion')

        cy.on('window:confirm', message => {
          expect(message).to.eq(regionTarget.confirmText)
          return true
        })

        cy.get(regionTarget.deleteButton).click()

        cy.wait('@deleteRegion').its('response.statusCode').should('be.oneOf', [200])

        cy.contains('Deleted item successfully.').should('be.visible')

        cy.url().should('include', '/region')
        cy.contains(name).should('not.exist')

        cy.visit(`/region/${createdId}`)
        cy.contains('Error loading data')
      })
    })
  })

  it('cancels deletion and keeps the region available', () => {
    cy.deleteTargets().then((targets: DeleteTarget[]) => {
      const regionTarget = targets.find(target => target.entity === 'Region')
      if (!regionTarget) {
        throw new Error('Region delete target metadata is missing')
      }

      const name = regionName('Cancel')

      cy.wrap(null).then(() => createRegion(regionTarget, name)).then(createdId => {
        let deleteCallCount = 0
        cy.intercept('DELETE', `**/region/${createdId}`, req => {
          deleteCallCount += 1
          req.reply({ statusCode: 500 })
        }).as('deleteRegionCancel')

        cy.on('window:confirm', message => {
          expect(message).to.eq(regionTarget.confirmText)
          return false
        })

        cy.get(regionTarget.deleteButton).click()

        cy.then(() => {
          expect(deleteCallCount).to.eq(0)
        })

        cy.contains('Deleted item successfully.').should('not.exist')
        cy.url().should('match', /\/region\/\d+$/)
        cy.contains(name).should('be.visible')

        cy.visit('/region')
        cy.contains(name).should('be.visible')
        cy.visit(`/region/${createdId}`)
        cy.contains(name).should('be.visible')
      })
    })
  })

  it('shows an error when deletion fails and leaves the region intact', () => {
    cy.deleteTargets().then((targets: DeleteTarget[]) => {
      const regionTarget = targets.find(target => target.entity === 'Region')
      if (!regionTarget) {
        throw new Error('Region delete target metadata is missing')
      }

      const name = regionName('Failure')
      const failureMessage = 'Test delete failure'

      cy.wrap(null).then(() => createRegion(regionTarget, name)).then(createdId => {
        cy.intercept('DELETE', `**/region/${createdId}`, {
          statusCode: 500,
          body: { message: failureMessage },
        }).as('deleteRegionFailure')

        cy.on('window:confirm', message => {
          expect(message).to.eq(regionTarget.confirmText)
          return true
        })

        cy.get(regionTarget.deleteButton).click()

        cy.wait('@deleteRegionFailure').its('response.statusCode').should('eq', 500)

        cy.contains(failureMessage).should('be.visible')
        cy.contains('Deleted item successfully.').should('not.exist')
        cy.url().should('match', /\/region\/\d+$/)
        cy.contains(name).should('be.visible')

        cy.visit('/region')
        cy.contains(name).should('be.visible')
      })
    })
  })
})
