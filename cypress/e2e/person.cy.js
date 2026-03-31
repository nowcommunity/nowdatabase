before('Reset database', () => {
  cy.resetDatabase()
})

describe('Creating a person', () => {
  beforeEach('Login as admin with session caching', () => {
    cy.loginWithSession('testSu')
  })

  it.skip('with valid data works', () => {})
})

describe('Editing a person', () => {
  beforeEach('Login as admin with session caching', () => {
    cy.loginWithSession('testSu')
  })

  it('with valid data works', () => {
    cy.visit(`/person/AD?tab=0`)
    cy.contains('adf')
    cy.contains('ads')
    cy.get('[id=edit-button]').click()
    cy.get('[id=initials-textfield]').should('be.disabled') // initials should never be edited
    cy.get('[id=first_name-textfield]').clear()
    cy.get('[id=first_name-textfield]').type('test first name')
    cy.get('[id=email-textfield]').clear()
    cy.get('[id=email-textfield]').type('test.email@provider.com')
    cy.get('[id=write-button]').click()
    cy.contains('test first name')
    cy.contains('test.email@provider.com')
  })

  it('user rights editing works', () => {
    cy.visit(`/person/AD?tab=0`)

    cy.get('[id=edit-button]').click()

    cy.contains('Choose user group').parent().type('e')
    cy.contains('er (edit restricted)').click()
    cy.get('[id=write-button]').click()

    cy.contains('er')
  })

  it('with any missing fields does not work', () => {
    cy.visit(`/person/AD?tab=0`)
    cy.contains('ads')
    cy.get('[id=edit-button]').click()
    cy.get('[id=first_name-textfield]').clear()
    cy.contains('First Name: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=first_name-textfield]').type('test first name')

    cy.get('[id=surname-textfield]').clear()
    cy.contains('Surname: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=surname-textfield]').type('test surname')

    cy.get('[id=email-textfield]').clear()
    cy.contains('Email: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=email-textfield]').type('test email')

    cy.get('[id=organization-textfield]').clear()
    cy.contains('Organization: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=organization-textfield]').type('test organization')

    cy.get('[id=Country-multiselect]').click()
    // cy.get('[id=Country-multiselect]').children('[data-testid=CloseIcon]').click() // clears the country dropdown
    // cy.contains('Country: This field is required')
    // cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=Country-multiselect]').type('Andorra')
    cy.contains('.MuiAutocomplete-option', 'Andorra').click() // this finds the Andorra inside the Autocomplete component

    cy.get('[id=write-button]').click()
  })
})

describe('User rights', () => {
  it('anonymous user sees the sign-in guard for person detail pages', () => {
    cy.visit(`/person/AD?tab=0`)
    cy.contains('Sign in to view this person')
  })

  it('restricted editor is redirected to their own person page when opening another person', () => {
    cy.loginWithSession('testEr')
    cy.visit(`/person/AD?tab=0`)
    cy.url().should('eq', 'http://localhost:5173/person/AD?tab=0')
    cy.get('[id=edit-button]').should('exist')
  })

  it('unrestricted editor is redirected to their own person page when opening another person', () => {
    cy.loginWithSession('testEu')
    cy.visit(`/person/AD?tab=0`)
    cy.url().should('eq', 'http://localhost:5173/person/AD?tab=0')
    cy.get('[id=edit-button]').should('exist')
  })

  it('admin can view other users directly', () => {
    cy.loginWithSession('testSu')
    cy.visit(`/person/AD?tab=0`)
    cy.url().should('eq', 'http://localhost:5173/person/AD?tab=0') // admin can see everyone's pages
    cy.get('[id=edit-button]').should('exist')
  })
})
