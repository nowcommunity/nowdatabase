before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Creating a region', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it.skip('with valid data works', () => {
    cy.visit('/region/new')
    cy.get('[id=order_name-textfield]').type('testOrder')
    cy.get('[id=family_name-textfield]').type('testFamily')
    cy.get('[id=genus_name-textfield]').type('testGenus')
    cy.get('[id=species_name-textfield]').type('testSpecies')
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('testOrder')
  })

  it.skip('with missing required fields does not work', () => {
    cy.visit('/species/new')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('4 Invalid fields')
  })
})

describe('Editing a region', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit(`/region/1?tab=0`)
    cy.contains('region 4452477e')
    cy.contains('prs')
    cy.contains('France')
    cy.get('[id=edit-button]').click()
    cy.contains('Select Coordinator').click()
    cy.get('[data-cy=detailview-button-AD]').click()
    cy.contains('Close').click()
    cy.contains('ads')
    cy.get('[id=country-multiselect]').click()
    cy.contains('Algeria').click()
    cy.get('[id=country-add-button]').click()
    cy.get('[id=write-button]').click()
    cy.contains('prs')
    cy.contains('ads')
    cy.contains('France')
    cy.contains('Spain')
    cy.contains('Algeria')
  })

  it('without any regional coordinators or countries works', () => {
    cy.visit(`/region/1?tab=0`)
    cy.contains('region 4452477e')
    cy.contains('prs')
    cy.contains('ads')
    cy.contains('France')
    cy.contains('Spain')
    cy.get('[id=edit-button]').click()
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click()
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click() // the two regional coordinators
    cy.get('[id=write-button]').click()
    cy.contains('region 4452477e')
    cy.contains('prs').should('not.exist')
    cy.contains('ads').should('not.exist')
    cy.contains('France')
    cy.contains('Spain')
    cy.get('[id=edit-button]').click()
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click()
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click()
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click() // the three countries
    cy.get('[id=write-button]').click()
    cy.contains('prs').should('not.exist')
    cy.contains('ads').should('not.exist')
    cy.contains('Algeria').should('not.exist')
    cy.contains('France').should('not.exist')
    cy.contains('Spain').should('not.exist')
  })

  it('add country button is disabled for invalid or empty countries', () => {
    cy.visit(`/region/1?tab=0`)
    cy.contains('region 4452477e')
    cy.get('[id=edit-button]').click()
    cy.get('[id=country-multiselect]').type('Invalid Country')
    cy.get('[id=country-add-button]').should('be.disabled')
    cy.get('[id=country-multiselect]').clear()
    cy.get('[id=country-add-button]').should('be.disabled')
  })
})
