before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Change password form validates passwords correctly and shows errors to the user', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('Missing fields are not allowed', () => {
    cy.visit('/person/user-page/')
    cy.contains('Change password')
    cy.get('[id=change-password-button]').click()
    cy.contains('Please fill all fields.')
    cy.get('[id=old-password-textfield]').type('test')
    cy.get('[id=change-password-button]').click()
    cy.contains('Please fill all fields.')
    cy.get('[id=new-password-textfield]').type('test2')
    cy.get('[id=change-password-button]').click()
    cy.contains('Please fill all fields.')
    cy.get('[id=new-password-verification-textfield]').type('test2')
    cy.get('[id=change-password-button]').click()
    cy.contains('Password must be at least 8 characters long')
  })

  it('Incorrect old password', () => {
    cy.visit('/person/user-page/')
    cy.contains('Change password')
    cy.get('[id=old-password-textfield]').type('incorrect')
    cy.get('[id=new-password-textfield]').type('Password1!')
    cy.get('[id=new-password-verification-textfield]').type('Password1!')
    cy.get('[id=change-password-button]').click()
    cy.contains('Old password does not match your current password.')
  })

  it('Invalid new password', () => {
    cy.visit('/person/user-page/')
    cy.contains('Change password')
    cy.get('[id=old-password-textfield]').type('test')
    cy.get('[id=new-password-textfield]').type('short')
    cy.get('[id=new-password-verification-textfield]').type('short')
    cy.get('[id=change-password-button]').click()
    cy.contains('Password must be at least 8 characters long')

    cy.get('[id=new-password-textfield]').clear()
    cy.get('[id=new-password-textfield]').type('€uroisnotallowed')
    cy.get('[id=new-password-verification-textfield]').clear()
    cy.get('[id=new-password-verification-textfield]').type('€uroisnotallowed')
    cy.get('[id=change-password-button]').click()
    cy.contains('Password must only contain characters a-z, A-Z, 0-9 and ^?$%&~!')
  })

  it('New password and verification do not match', () => {
    cy.visit('/person/user-page/')
    cy.contains('Change password')
    cy.get('[id=old-password-textfield]').type('test')
    cy.get('[id=new-password-textfield]').type('Password1!')
    cy.get('[id=new-password-verification-textfield]').type('Password')
    cy.get('[id=change-password-button]').click()
    cy.contains('New password was not the same in both fields.')
  })

  it('Changing succeeds with valid password', () => {
    cy.visit('/person/user-page/')
    cy.contains('Change password')
    cy.get('[id=old-password-textfield]').type('test')
    cy.get('[id=new-password-textfield]').type('Password1!')
    cy.get('[id=new-password-verification-textfield]').type('Password1!')
    cy.get('[id=change-password-button]').click()
    cy.contains('Password changed successfully.')

    // test that password is actually updated
    cy.get('[id=old-password-textfield]').type('Password1!')
    cy.get('[id=new-password-textfield]').type('Password2!')
    cy.get('[id=new-password-verification-textfield]').type('Password2!')
    cy.get('[id=change-password-button]').click()
    cy.contains('Password changed successfully.')
  })
})
