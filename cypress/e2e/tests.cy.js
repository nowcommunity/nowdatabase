const baseUrl = 'http://localhost:5173/'

describe('Open each page: tableview and detailview', () => {
  beforeEach(() => {
    cy.visit(baseUrl)
  })
  it('Frontpage contains text', () => {
    cy.contains('construction')
  })
  it('Can open locality table and it shows data', () => {
    cy.contains('Locality').click()
    cy.contains('Dmanisi')
    cy.get('[data-cy="detailview-button"]').first().click()
    cy.contains('Dating method')
    cy.contains('bahean')
  })
  it('Can open species table and it shows data', () => {
    cy.contains('Species').click()
    cy.contains('Rodentia')
    cy.get('[data-cy="detailview-button"]').first().click()
    cy.contains('Class')
    cy.contains('Simplomys')
  })
  it('Can open reference table and it shows data', () => {
    cy.contains('Reference').click()
    cy.contains('A Concise Geologic Time')
    cy.get('[data-cy="detailview-button"]').first().click()
    cy.contains('Reference type')
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic')
  })
  it('Can open time unit table and it shows data', () => {
    cy.contains('Time Unit').click()
    cy.contains('Langhian')
    cy.get('[data-cy="detailview-button"]').first().click()
    cy.contains('Sequence')
    cy.contains('chlma')
  })
  it('Can open region table and it shows data', () => {
    cy.contains('Region').click()
    cy.contains('region 4452477e')
    cy.get('[data-cy="detailview-button"]').first().click()
    cy.contains('Regional Coordinators')
    cy.contains('prs')
  })
  it('Can open project table and it shows data', () => {
    cy.contains('Project').click()
    cy.contains('Workgroup on Insectivores')
    cy.get('[data-cy="detailview-button"]').first().click()
    cy.contains('Coordinator')
    cy.contains('NOW Database')
  })
  it('Can open time bound table and it shows data', () => {
    cy.contains('Time Bound').click()
    cy.contains('C2N-y')
    cy.get('[data-cy="detailview-button"]').first().click()
    cy.contains('Bound')
    cy.contains('1.778')
  })
})
