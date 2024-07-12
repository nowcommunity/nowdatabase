
describe('Broadly test what different user rights see', () => {
  describe('Admin visibility', () => {
    before('Login as admin', () => {
      cy.session('admin-session', () => {})
      cy.login('testSu')
    })
    it('Sees new and delete buttons in tableviews', () => {
      cy.visit('/locality')
      cy.contains('Delete')
      cy.contains('New').click()
      cy.contains('Time Unit')
      cy.contains('Creating new locality')
    })
    it('Region works', () => {
      cy.get('div[id="/admin-menu-button"]').click()
      cy.contains('Regions').click()
      cy.contains('region 4452477e')
      cy.get('[data-cy="detailview-button-1"]').first().click()
      cy.contains('Regional Coordinators')
      cy.contains('prs')
    })
    it('Project works', () => {
      cy.get('div[id="/admin-menu-button"]').click()
      cy.get('a[id="/project-menu-link"]').click()
      cy.contains('Workgroup on Insectivores')
      cy.get('[data-cy="detailview-button-3"]').first().click()
      cy.contains('Coordinator')
      cy.contains('NOW Database')
    })
    it('Time Bound works', () => {
      cy.contains('Time Bounds').click()
      cy.contains('C2N-y')
      cy.get('[data-cy="detailview-button-11"]').first().click()
      cy.contains('Bound')
      cy.contains('1.778')
    })
  })
  describe('Test unlogged visibility', () => {
    before('Ensure logout', () => {
      cy.clearAllLocalStorage()
      cy.visit('/')
      cy.contains('Guest user')
    })
    it('Does not see admin button in navbar', () => {
      cy.contains('Admin').should('not.exist')
    })
    it('Does not see time bounds in navbar', () => {
      cy.contains('Time Bound').should('not.exist')
    })
    it('Direct routes to protected views do not work', () => {
      cy.pageForbidden('person')
      cy.pageForbidden('region')
      cy.pageForbidden('time-bound')
      cy.pageForbidden('project')
    })
  })
})
