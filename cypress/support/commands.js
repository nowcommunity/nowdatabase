// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', username => {
  cy.clearAllLocalStorage()
  cy.clearAllSessionStorage()
  cy.clearCookies()
  cy.intercept('POST', '**/user/login').as('loginRequest')
  cy.visit('/login')
  cy.get('[data-cy="username-basic"] input', { timeout: 10000 }).should('be.visible').clear().type(username)
  cy.get('[data-cy="password-basic"] input').should('be.visible').clear().type('test', { log: false })
  cy.get('[data-cy="login-button"]').should('be.visible').click()
  cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
  cy.window().should(window => {
    const storedUserState = window.localStorage.getItem('userState')
    expect(storedUserState, 'stored user state').to.not.be.null

    const parsedUserState = JSON.parse(storedUserState)
    expect(parsedUserState?.token, 'stored login token').to.be.a('string').and.not.be.empty
  })
  cy.contains('.username-box', username, { timeout: 30000 }).should('be.visible')
})

Cypress.Commands.add('loginAsDeleteCoordinator', () => {
  cy.fixture('login').then(({ deleteCoordinator }) => {
    cy.login(deleteCoordinator.username)
  })
})

Cypress.Commands.add('deleteTargets', () => {
  return cy.fixture('login').its('deleteTargets')
})

Cypress.Commands.add('pageForbidden', url => {
  cy.visit(url)
  cy.get('body').should(body => {
    const text = body.text()
    expect(text).to.satisfy(
      value =>
        value.includes('Your user is not authorized to view this page.') ||
        value.includes('Permission denied') ||
        value.includes('You do not have access') ||
        value.includes('Sign in to')
    )
  })
})

Cypress.Commands.add('resetDatabase', () => {
  cy.task('waitForDbHealthy')
  cy.request(Cypress.env('databaseResetUrl')).its('status').should('eq', 200)
})

// Optimized database reset that only resets once per test file
Cypress.Commands.add('resetDatabaseOnce', () => {
  const currentSpec = Cypress.spec.name
  const resetKey = `dbReset_${currentSpec}`
  
  if (!window[resetKey]) {
    cy.resetDatabase()
    window[resetKey] = true
  }
})

// Login command with session caching for better performance
Cypress.Commands.add('loginWithSession', (username) => {
  cy.session(username, () => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.clearCookies()
    cy.intercept('POST', '**/user/login').as('loginRequest')
    cy.visit('/login')
    cy.get('[data-cy="username-basic"] input', { timeout: 10000 }).should('be.visible').clear().type(username)
    cy.get('[data-cy="password-basic"] input').should('be.visible').clear().type('test', { log: false })
    cy.get('[data-cy="login-button"]').should('be.visible').click()
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.window().should(window => {
      const storedUserState = window.localStorage.getItem('userState')
      expect(storedUserState, 'stored user state').to.not.be.null

      const parsedUserState = JSON.parse(storedUserState)
      expect(parsedUserState?.token, 'stored login token').to.be.a('string').and.not.be.empty
    })
  }, {
    validate: () => {
      // Validate the session is still valid by checking for the username box
      cy.visit('/')
      cy.contains('.username-box', username, { timeout: 10000 }).should('be.visible')
    }
  })
})

// use this once you have edited some data and want to save it
Cypress.Commands.add('addReferenceAndSave', () => {
  cy.get('[id=write-button]').click()
  cy.get('[id=write-button]').should('be.disabled')
  cy.contains('button', 'Add existing reference').click()
  cy.get('button[data-cy^="add-button"]').first().click()
  cy.contains('button', 'Close').click()
  cy.get('[id=write-button]').should('not.be.disabled')
  cy.get('[id=write-button]').click()
})

Cypress.Commands.add('clearNewSpeciesForm', () => {
  cy.get('[name=order_name]').clear()
  cy.get('[name=family_name]').clear()
  cy.get('[name=genus_name]').clear()
  cy.get('[name=species_name]').clear()
  cy.get('[name=subclass_or_superorder_name]').clear()
  cy.get('[name=suborder_or_superfamily_name]').clear()
  cy.get('[name=subfamily_name]').clear()
  cy.get('[name=unique_identifier]').clear()
  cy.get('[name=sp_comment]').clear()
  cy.get('[name=sp_author]').clear()
})
