before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Creating a person', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it.skip('with valid data works', () => {})
})

describe('Editing a person', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
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
    cy.contains('er').click()
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
  it('when on a non-admin account, user gets redirected to their own user page', () => {
    cy.visit(`/person/AD?tab=0`)
    cy.url().should('eq', 'http://localhost:5173/person/user-page')
    cy.contains('Error loading data') // no user page for an anonymous user

    cy.login('testEr')
    cy.visit(`/person/AD?tab=0`)
    cy.url().should('eq', 'http://localhost:5173/person/user-page')
    cy.get('[id=edit-button]').should('exist')

    cy.login('testEu')
    cy.visit(`/person/AD?tab=0`)
    cy.url().should('eq', 'http://localhost:5173/person/user-page')
    cy.get('[id=edit-button]').should('exist')

    cy.login('testSu')
    cy.visit(`/person/AD?tab=0`)
    cy.url().should('eq', 'http://localhost:5173/person/AD?tab=0') // admin can see everyone's pages
    cy.get('[id=edit-button]').should('exist')
  })
})
