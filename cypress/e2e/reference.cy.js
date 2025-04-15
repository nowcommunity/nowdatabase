before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Creating a reference', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it.skip('with valid data works', () => {})

  it.skip('with missing required fields does no work', () => {})

  // TODO: add more tests for different types of references etc.
})

describe('Editing a reference', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it.skip('with valid data works', () => {})

  it.skip('with missing required fields does no work', () => {})

  // TODO: add more tests for different types of references etc.
})

describe('Deleting a reference', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it.skip('that is not linked to anything works and returns user to table view', () => {
    // TODO: Create a new reference in anon database that is not linked to any localities or species
    cy.visit('/reference/<reference_id>')
    cy.get('[id=delete-button]').should('exist').click()
    cy.on('window:confirm', str => {
      expect(str).to.eq('Are you sure you want to delete this item? This operation cannot be undone.')
      // this automatically clicks the OK button and returns to table view
    })
    cy.contains('Deleted item successfully.')
    cy.contains('Dated co-occurrence of Homo erectus and Gigantopithecus from Tham Khuyen Cave, Vietnam') // check that table view has been navigated to
    cy.contains('<Deleted reference title>').should('not.exist')
    cy.visit('/reference/<reference_id>')
    cy.contains('Error loading data')
  })

  // Skipped because referecnes that have linked localities or species cannot be deleted currently.
  it.skip('that is linked to a locality and a species works and returns user to table view', () => {
    cy.visit('/reference/10039')
    cy.get('[id=delete-button]').should('exist').click()
    cy.on('window:confirm', str => {
      expect(str).to.eq('Are you sure you want to delete this item? This operation cannot be undone.')
      // this automatically clicks the OK button and returns to table view
    })
    cy.contains('Deleted item successfully.')
    cy.contains('Dated co-occurrence of Homo erectus and Gigantopithecus from Tham Khuyen Cave, Vietnam') // check that table view has been navigated to
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic').should('not.exist')
    cy.visit('/reference/10039')
    cy.contains('Error loading data')
  })
})
