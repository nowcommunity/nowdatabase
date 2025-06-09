before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Creating a region', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit('/region/new')
    cy.contains('Creating new region')
    cy.contains('Region: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=region-textfield]').type('Test Region')
    cy.contains('Region: This field is required').should('not.exist')
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()
    cy.contains('Test Region')
    cy.get('[id=delete-button]').should('exist')
    cy.visit('/region/')
    cy.contains('Test Region')
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
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click() // removes the two regional coordinators
    cy.get('[id=write-button]').click()
    cy.contains('region 4452477e')
    cy.contains('prs').should('not.exist')
    cy.contains('ads').should('not.exist')
    cy.contains('France')
    cy.contains('Spain')
    cy.get('[id=edit-button]').click()
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click()
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click()
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click() // removes the three countries
    cy.get('[id=write-button]').click()
    cy.contains('prs').should('not.exist')
    cy.contains('ads').should('not.exist')
    cy.contains('Algeria').should('not.exist')
    cy.contains('France').should('not.exist')
    cy.contains('Spain').should('not.exist')
  })

  it('with duplicate countries does not work', () => {
    cy.visit(`/region/1?tab=0`)
    cy.contains('region 4452477e')
    cy.get('[id=edit-button]').click()
    cy.get('[id=country-multiselect]').click()
    cy.contains('Algeria').click()
    cy.get('[id=country-add-button]').click()
    cy.get('[id=country-multiselect]').click()
    cy.contains('.MuiAutocomplete-option', 'Algeria').click() // this finds the Algeria inside the Autocomplete component
    cy.get('[id=country-add-button]').click()
    cy.contains('Countries: Duplicate country in country list')
    cy.get('[id=write-button]').should('be.disabled')
  })

  it('with no region name does not work', () => {
    cy.visit(`/region/1?tab=0`)
    cy.contains('region 4452477e')
    cy.get('[id=edit-button]').click()
    cy.get('[id=region-textfield]').clear()
    cy.contains('Region: This field is required')
    cy.get('[id=write-button]').should('be.disabled')
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

describe('Deleting a region', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('works and returns user to table view', () => {
    cy.visit('/region/1')
    cy.get('[id=delete-button]').should('exist').click()
    cy.on('window:confirm', str => {
      expect(str).to.eq('Are you sure you want to delete this item? This operation cannot be undone.')
      // this automatically clicks the OK button and returns to table view
    })
    cy.contains('region 44524b6e') // check that table view has been navigated to
    cy.contains('region 4452477e').should('not.exist')
    cy.visit('/region/1')
    cy.contains('Error loading data')
  })
})
