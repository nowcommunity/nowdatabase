before('Reset database', () => {
  cy.resetDatabase()
})

describe('Occurrence editing', () => {
  it('allows admin to open edit mode and finalize flow', () => {
    cy.login('testSu')
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
    cy.login('testEu')
    cy.visit('/occurrence/21050/85729')

    cy.get('#edit-button').should('not.exist')
    cy.get('#write-button').should('not.exist')
  })
})
