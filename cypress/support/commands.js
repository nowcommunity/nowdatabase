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
  cy.clearLocalStorage()
  cy.visit('/login')
  cy.get('[data-cy="login-button"]', { timeout: 10000 }).should('be.visible').click()
  cy.get('[data-cy="username-basic"]').type(username)
  cy.get('[data-cy="password-basic"]').type('test')
  cy.get('[data-cy="login-button"]').click()
  cy.contains(`${username}`)
})

Cypress.Commands.add('pageForbidden', url => {
  cy.visit(url)
  cy.contains('Your user is not authorized to view this page.')
})

Cypress.Commands.add('resetDatabase', () => {
  cy.task('resetDatabase')
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
  cy.get('[name=taxonomic_status]').clear()
  cy.get('[name=sp_comment]').clear()
  cy.get('[name=sp_author]').clear()
})
