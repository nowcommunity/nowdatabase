before('Reset database', () => {
  cy.resetDatabase()
})

describe('Adding occurrence through Locality -> Occurrences tab', () => {
  it('opens a new tab', () => {
    cy.loginWithSession('testSu')
    cy.visit('locality/21050?tab=3', {
      onBeforeLoad(win) {
        cy.stub(win, 'open').as('windowOpen')
      },
    })
    cy.get('#edit-button').should('exist').click()
    cy.get('#create-occurrence-button').should('not.be.disabled').click()
    cy.get('@windowOpen').should('be.called')
  })
  it('is not possible if the locality is being created', () => {
    cy.loginWithSession('testSu')
    cy.visit('locality/new?tab=3')
    cy.get('#create-occurrence-button').should('exist').should('be.disabled')
  })
})

describe('Occurrence editing', () => {
  it('allows admin to open edit mode and finalize flow', () => {
    cy.loginWithSession('testSu')
    cy.visit('/occurrence/21050/85729')

    cy.get('#edit-button').should('exist').click()
    cy.get('#write-button').should('contain.text', 'Finalize entry')

    cy.get('[id=source_name-textfield]').clear()
    cy.get('[id=source_name-textfield]').type('Occurrence E2E source')
    cy.get('#write-button').should('not.be.disabled').click()

    cy.get('#write-button').should('contain.text', 'Complete and save')
    cy.contains('Add existing reference').should('be.visible')
  })

  it('prevents read-only user from editing occurrence', () => {
    cy.loginWithSession('testEu')
    cy.visit('/occurrence/21050/85729')

    cy.get('#edit-button').should('not.exist')
    cy.get('#write-button').should('not.exist')
  })
})
