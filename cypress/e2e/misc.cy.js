/*
  This suite is meant to add tests for individual features, including things such as
  visiting specific url's directly.
*/

describe('Test individual features across the app', () => {
  it('Locality update tab opens, detailed modal works, view-link works', () => {
    cy.visit(`/locality/24750?tab=10`)
    cy.contains('2006-10-16')
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic Geology 1992')
    cy.get('[data-cy="update-details-button"]').first().click()
    cy.contains('now_syn_loc')
    cy.contains('24750')
    cy.contains(`Romanya d'Emporda`)
    cy.contains('Add')
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic Geology 1992')
    cy.contains('View').click()
    cy.contains('Reference type')
  })
})

