/*
  This suite is meant to add tests for individual features, including things such as
  visiting specific url's directly.
*/

const hasStagingMode = viewUrl => {
  cy.visit(viewUrl)
  cy.contains('Edit').click()
  cy.contains('Finalize entry').click()
  cy.contains('Complete and save')
  cy.contains('Reference for the new data')
}

const doesNotHaveStagingMode = viewUrl => {
  cy.visit(viewUrl)
  cy.contains('Edit').click()
  cy.contains('Finalize entry').should('not.exist')
  cy.contains('Reference for the new data').should('not.exist')
  cy.contains('Save changes').click()
  cy.contains('Edit')
}

before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Test individual features across the app', () => {
  it('Locality update tab opens, detailed modal works, view-link works', () => {
    cy.visit(`/locality/24750?tab=10`)
    cy.contains('2006-10-16')
    cy.contains(
      'Cande (1992). A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic. Geology 97: 13917-13951.'
    )
    cy.get('[data-cy="update-details-button"]').first().click()
    cy.contains('now_syn_loc')
    cy.contains('24750')
    cy.contains(`Romanya d'Emporda`)
    cy.contains('Add')
    cy.contains(
      'Cande (1992). A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic. Geology 97: 13917-13951.'
    )
    cy.contains('View').click()
    cy.contains('Reference type')
  })

  describe('Staging mode works for the data types that require it', () => {
    beforeEach('Login as admin', () => {
      cy.login('testSu')
    })

    it('Staging mode works on locality', () => {
      cy.login('testSu')
      hasStagingMode('locality/24750')
    })

    it('Staging mode works on species', () => {
      cy.login('testSu')
      hasStagingMode('species/21052')
    })

    it('Staging mode works on time unit', () => {
      cy.login('testSu')
      hasStagingMode('time-unit/bahean')
    })

    it('Staging mode works on time bound', () => {
      cy.login('testSu')
      hasStagingMode('time-bound/11')
    })
  })

  // TODO remove the skips once onWrite's has been added to all
  describe('Staging mode does not appear for the data types that dont require it', () => {
    beforeEach('Login as admin', () => {
      cy.login('testSu')
    })

    it('Staging mode does not appear on reference', () => {
      cy.login('testSu')
      doesNotHaveStagingMode('reference/10039')
    })

    it.skip('Staging mode does not appear on regions', () => {
      cy.login('testSu')
      doesNotHaveStagingMode('region/1')
    })

    it.skip('Staging mode does not appear on projects', () => {
      cy.login('testSu')
      doesNotHaveStagingMode('project/3')
    })

    it.skip('Staging mode does not appear on person page', () => {
      cy.login('testSu')
      doesNotHaveStagingMode('person/AD')
    })
  })
})
