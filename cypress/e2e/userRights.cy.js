before('Reset database', () => {
  cy.request(Cypress.env("databaseResetUrl"));
});

describe('Broadly test what different user rights see', () => {
  describe('Admin visibility', () => {
    beforeEach('Login as admin', () => {
      cy.session('admin-session', () => { })
      cy.login('testSu')
    })
    it('Sees new button in tableviews', () => {
      cy.visit('/locality')
      cy.contains('New').click()
      cy.contains('Time Unit')
      cy.contains('Creating new locality')
    })
    it('Regions view shows correctly', () => {
      cy.get('div[id="/admin-menu-button"]').click()
      cy.contains('Regions').click()
      cy.contains('region 4452477e')
      cy.get('[data-cy="detailview-button-1"]').first().click()
      cy.contains('Regional Coordinators')
      cy.contains('prs')
      cy.get('[id="edit-button"]').should('exist')
      cy.get('[id="delete-button"]').should('exist')
    })
    it('Projects view shows correctly', () => {
      cy.get('div[id="/admin-menu-button"]').click()
      cy.get('a[id="/project-menu-link"]').click()
      cy.contains('Workgroup on Insectivores')
      cy.get('[data-cy="detailview-button-3"]').first().click()
      cy.contains('Coordinator')
      cy.contains('NOW Database')
      cy.get('[id="edit-button"]').should('exist')
      cy.get('[id="delete-button"]').should('exist')
    })
    it('Time Bound view shows correctly', () => {
      cy.contains('Time Bounds').click()
      cy.contains('C2N-y')
      cy.get('[data-cy="detailview-button-11"]').first().click()
      cy.contains('Bound')
      cy.contains('1.778')
      cy.get('[id="edit-button"]').should('exist')
      cy.get('[id="delete-button"]').should('exist')
    })
    it('Email page opens', () => {
      cy.get('div[id="/admin-menu-button"]').click()
      cy.contains('Email').click()
      cy.contains('Send email')
    })
  })
  describe('Test unlogged visibility', () => {
    beforeEach('Ensure logout', () => {
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
      cy.pageForbidden('/region')
      cy.pageForbidden('/time-bound')
      cy.pageForbidden('/project')
    })
    it('Does not see email page', () => {
      cy.pageForbidden('/email')
    })
    it('Does not see the New button in table view', () => {
      cy.visit('/locality')
      cy.contains('New').should('not.exist')
      cy.visit('/species')
      cy.contains('New').should('not.exist')
      cy.visit('/reference')
      cy.contains('New').should('not.exist')
      cy.visit('/time-unit')
      cy.contains('New').should('not.exist')
    })
    it('Does not see edit or delete buttons in detailview', () => {
      cy.visit('locality/20920')
      cy.contains('Lantian-Shuijiazui')
      cy.get('[id="edit-button"]').should('not.exist')
      cy.get('[id="delete-button"]').should('not.exist')
      cy.visit('species/21052')
      cy.contains('Simplomys simplicidens')
      cy.get('[id="edit-button"]').should('not.exist')
      cy.get('[id="delete-button"]').should('not.exist')
      cy.visit('reference/10039')
      cy.contains('A new geomagnetic polarity time scale')
      cy.get('[id="edit-button"]').should('not.exist')
      cy.get('[id="delete-button"]').should('not.exist')
      cy.visit('time-unit/bahean')
      cy.contains('Bahean')
      cy.get('[id="edit-button"]').should('not.exist')
      cy.get('[id="delete-button"]').should('not.exist')
    })
  })
})
