/*
  This suite is meant to add tests for individual features, including things such as
  visiting specific url's directly.
*/

const visitEntry = viewUrl => {
  const normalizedUrl = viewUrl.startsWith('/') ? viewUrl : `/${viewUrl}`
  cy.visit(normalizedUrl)
}

const hasStagingMode = (viewUrl, makeDirty) => {
  visitEntry(viewUrl)
  cy.contains('Edit', { timeout: 20000 }).should('be.visible').click()
  makeDirty()
  cy.get('#write-button').should('not.be.disabled')
  cy.contains('Finalize entry', { timeout: 15000 }).should('be.visible').click()
  cy.contains('Complete and save', { timeout: 15000 }).should('be.visible')
  cy.contains('Reference for the new data', { timeout: 15000 }).should('be.visible')
}

const doesNotHaveStagingMode = viewUrl => {
  visitEntry(viewUrl)
  cy.contains('Edit', { timeout: 20000 }).should('be.visible').click()
  cy.contains('Finalize entry', { timeout: 15000 }).should('not.exist')
  cy.contains('Reference for the new data', { timeout: 15000 }).should('not.exist')
  cy.contains('Save changes', { timeout: 15000 }).should('be.visible').click()
  cy.contains('Edit', { timeout: 15000 }).should('be.visible')
}

before('Reset database', () => {
  cy.resetDatabase()
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
      hasStagingMode('locality/24750', () => {
        cy.get('[role=tablist]').contains('Locality').click()
        cy.get('[id=loc_name-textfield]').type(' staging')
      })
    })

    it('Staging mode works on species', () => {
      hasStagingMode('species/21052', () => {
        cy.get('[id=sp_comment-textfield]').type('staging comment')
      })
    })

    it('Staging mode works on time unit', () => {
      hasStagingMode('time-unit/bahean', () => {
        cy.get('[id=sequence-tableselection]').first().click()
        cy.get('[data-cy=add-button-ALMAAsianlandmammalage]').first().click()
      })
    })

    it('Staging mode works on time bound', () => {
      hasStagingMode('time-bound/11', () => {
        cy.get('[id=age-textfield]').first().clear()
        cy.get('[id=age-textfield]').first().type('1.5')
      })
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
