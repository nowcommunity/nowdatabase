
describe('Open each page, table view and detail view, and check at least some correct text appears', () => {
  before('Login as admin, directs to front page', () => {
    cy.session("logged-as-admin", () => {})
    cy.login('testSu')
  })
  beforeEach(() => {
    cy.visit('/')
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
})
