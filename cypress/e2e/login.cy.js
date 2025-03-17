before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('User redirecting after logging in works', () => {
  it('When user logs in for the first time, they are redirected to the password change form and shown a warning', () => {
    cy.login('testSu') // test users should have their last_login value set to null by default
    cy.url().should('contain', 'person/user-page?tab=0')
    cy.contains('First login detected. Please change your password!')

    cy.login('testEr')
    cy.url().should('contain', 'person/user-page?tab=0')
    cy.contains('First login detected. Please change your password!')
  })

  it('users that have logged in before do not get redirected', () => {
    cy.login('testSu')
    cy.contains('Welcome')
    cy.contains('Logged in!')

    cy.login('testEr')
    cy.contains('Welcome')
    cy.contains('Logged in!')
  })
})
