before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Deleting a region', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('works and returns user to table view', () => {
    cy.visit('/region/1')
    cy.get('[id=delete-button]').should('exist').click()
    cy.on('window:confirm', str => {
      expect(str).to.eq('Are you sure you want to delete this item? This operation cannot be undone.')
      // this automatically clicks the OK button and returns to table view
    })
    cy.contains('region 44524b6e')
    cy.contains('region 4452477e').should('not.exist')
  })
})
