before('Reset database', () => {
  cy.request(Cypress.env('databaseResetUrl'))
})

describe('Creating a journal', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit('/reference/new')
    cy.contains('Journal')
    cy.contains('7 Invalid fields')

    cy.get('[id=title_primary-textfield]').type('New test reference')

    cy.get('[data-cy=Select\\ author-button]').click()
    cy.get('[data-cy=detailview-button-1]').click()
    cy.contains('Close').click()

    cy.get('[id=date_primary-textfield]').type('2025')

    cy.get('[data-cy=Select\\ Journal-button]').click()
    cy.get('[data-cy=detailview-button-100]').click()
    cy.contains('Close').click()

    cy.get('[id=write-button]').click()
    cy.contains('Saved reference successfully.')
  })

  it('with missing required fields does not work', () => {
    cy.visit('/reference/new')
    cy.contains('Journal')
    cy.contains('7 Invalid fields')

    cy.get('[id=title_primary-textfield]').type('New test reference 2')
    cy.contains('3 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[data-cy=Select\\ author-button]').click()
    cy.get('[data-cy=detailview-button-1]').click()
    cy.contains('Close').click()
    cy.contains('2 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[id=date_primary-textfield]').type('2025')
    cy.contains('1 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[data-cy=Select\\ Journal-button]').click()
    cy.get('[data-cy=detailview-button-100]').click()
    cy.contains('Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')

    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click() // removes the selected author
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[data-cy=Select\\ author-button]').click()
    cy.get('[data-cy=detailview-button-1]').click()
    cy.contains('Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
  })

  it('combined check with different types of titles and gen notes works', () => {
    cy.visit('/reference/new')
    cy.contains('Journal')
    cy.contains('7 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[id=title_primary-textfield]').type('Title Primary')
    cy.contains('3 Invalid fields')
    cy.get('[id=title_primary-textfield]').clear()
    cy.contains('7 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[id=title_secondary-textfield]').type('Title Secondary')
    cy.contains('3 Invalid fields')
    cy.get('[id=title_secondary-textfield]').clear()
    cy.contains('7 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[id=title_series-textfield]').type('Title Series')
    cy.contains('3 Invalid fields')
    cy.get('[id=title_series-textfield]').clear()
    cy.contains('7 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')

    cy.get('[id=gen_notes-textfield]').type('Gen Notes')
    cy.contains('3 Invalid fields')
    cy.get('[id=gen_notes-textfield]').clear()
    cy.contains('7 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')
  })
})

// TODO: add more tests for different types of references

describe('Editing a journal', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit('reference/10039')
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic.')
    cy.get('[id=edit-button]').click()
    cy.get('[id=title_primary-textfield]').clear()
    cy.get('[id=title_primary-textfield]').type('New primary title.')

    cy.get('[data-cy=Select\\ author-button]').click()
    cy.get('[data-cy=detailview-button-2]').click()
    cy.contains('Close').click()

    cy.get('[id=write-button]').click()
    cy.contains('Saved reference successfully.')
    cy.contains('New primary title.')
    cy.contains('Cande') // Author 1
    cy.contains('Ciochon') // Author 2
  })

  it('with missing required fields does not work', () => {
    cy.visit('reference/10039')
    cy.contains('New primary title.')
    cy.get('[id=edit-button]').click()
    cy.get('[id=title_primary-textfield]').clear()
    cy.contains('4 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=title_primary-textfield]').type('New primary title.')

    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click()
    cy.get('[data-testid=RemoveCircleOutlineIcon]').first().click() // removes the selected authors
    cy.contains('1 Invalid fields')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[data-cy=Select\\ author-button]').click()
    cy.get('[data-cy=detailview-button-1]').click()
    cy.contains('Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
  })
})

// TODO: add more tests for different types of references

describe('Deleting a reference', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('that is not linked to anything works and returns user to table view', () => {
    cy.visit('/reference/25000')
    cy.get('[id=delete-button]').should('exist').click()
    cy.on('window:confirm', str => {
      expect(str).to.eq('Are you sure you want to delete this item? This operation cannot be undone.')
      // this automatically clicks the OK button and returns to table view
    })
    cy.contains('Deleted item successfully.')
    cy.contains('Dated co-occurrence of Homo erectus and Gigantopithecus from Tham Khuyen Cave, Vietnam') // check that table view has been navigated to
    cy.contains('A test reference that is not linked to any localities or species').should('not.exist')
    cy.visit('/reference/25000')
    cy.contains('Error loading data')
  })

  // Skipped because references that have linked localities or species cannot be deleted currently
  it.skip('that is linked to a locality and a species works and returns user to table view', () => {
    cy.visit('/reference/10039')
    cy.get('[id=delete-button]').should('exist').click()
    cy.on('window:confirm', str => {
      expect(str).to.eq('Are you sure you want to delete this item? This operation cannot be undone.')
      // this automatically clicks the OK button and returns to table view
    })
    cy.contains('Deleted item successfully.')
    cy.contains('Dated co-occurrence of Homo erectus and Gigantopithecus from Tham Khuyen Cave, Vietnam') // check that table view has been navigated to
    cy.contains('A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic').should('not.exist')
    cy.visit('/reference/10039')
    cy.contains('Error loading data')
  })
})
