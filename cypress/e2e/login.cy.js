before('Reset database', () => {
  cy.resetDatabase()
})

describe('User redirecting after logging in works', () => {
  it('testSu is redirected to the password change form on first login', () => {
    cy.login('testSu') // test users should have their last_login value set to null by default
    cy.url().should('contain', 'person/user-page?tab=0')
    cy.contains('First login detected. Please change your password!')
  })

  it('testEr is redirected to the password change form on first login', () => {
    cy.login('testEr')
    cy.url().should('contain', 'person/user-page?tab=0')
    cy.contains('First login detected. Please change your password!')
  })

  it('testSu does not get redirected after the first login has already happened', () => {
    cy.login('testSu')
    cy.contains('Welcome')
    cy.contains('Logged in!')
  })

  it('testEr does not get redirected after the first login has already happened', () => {
    cy.login('testEr')
    cy.contains('Welcome')
    cy.contains('Logged in!')
  })
})
