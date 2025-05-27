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
  cy.contains('Login').click()
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
