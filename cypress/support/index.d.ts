/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(username: string): Chainable<void>
    pageForbidden(url: string): Chainable<void>
    resetDatabase(): Chainable<void>
    addReferenceAndSave(): Chainable<void>
    clearNewSpeciesForm(): Chainable<void>
  }

  interface Tasks {
    waitForDbHealthy(options?: WaitForDbHealthyOptions): null
  }
}

interface WaitForDbHealthyOptions {
  host?: string
  port?: number
  timeoutMs?: number
}
