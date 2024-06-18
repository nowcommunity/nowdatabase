const baseUrl = 'http://localhost:5173/'

describe('Open each page, table view and detail view, and check at least some correct text appears', () => {
  beforeEach(() => {
    cy.visit(baseUrl)
  })
  it('Front page works', () => {
    cy.contains('construction')
  })
  it('Locality works', () => {
    cy.contains('Locality').click()
    cy.contains('Dmanisi')
    cy.get('[data-cy="detailview-button-21050"]').click()
    cy.contains('Dating method')
    cy.contains('olduvai')
  })
  it('Species works', () => {
    cy.contains('Species').click()
    cy.contains('Rodentia')
    cy.get('[data-cy="detailview-button-21052"]').first().click()
    cy.contains('Class')
    cy.contains('Simplomys')
  })
  it('Reference works', () => {
    cy.contains('Reference').click()
    cy.contains('A Concise Geologic Time')
    cy.get('[data-cy="detailview-button-10039"]').first().click()
    cy.contains('Reference type')
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic')
  })
  it('Time Unit works', () => {
    cy.contains('Time Unit').click()
    cy.contains('Langhian')
    cy.get('[data-cy="detailview-button-langhian"]').first().click()
    cy.contains('Sequence')
    cy.contains('gcss')
  })
  it('Region works', () => {
    cy.contains('Admin').click()
    cy.contains('Region').click()
    cy.contains('region 4452477e')
    cy.get('[data-cy="detailview-button-1"]').first().click()
    cy.contains('Regional Coordinators')
    cy.contains('prs')
  })
  it.only('Project works', () => {
    cy.get('div[id="/admin-menu-button"]').click()
    cy.get('a[id="/project-menu-link"]').click()
    cy.contains('Workgroup on Insectivores')
    cy.get('[data-cy="detailview-button-3"]').first().click()
    cy.contains('Coordinator')
    cy.contains('NOW Database')
  })
  it('Time Bound works', () => {
    cy.contains('Time Bound').click()
    cy.contains('C2N-y')
    cy.get('[data-cy="detailview-button-11"]').first().click()
    cy.contains('Bound')
    cy.contains('1.778')
  })
})
