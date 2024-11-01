describe('Locality min and max age checks work', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it.skip('Editing a locality with contradictory min and max ages does not work', () => {
    cy.on('uncaught:exception', error => {
      // this is here to ignore the error that happens when you put contradictory data to backend
      // might ignore errors that should not be ignored too!
      console.log(error)
      return false
    })

    cy.visit(`/locality/20920?tab=0`)
    cy.contains('Dating method')
    cy.get('[id=edit-button]').click()
    // the id's for these next two might change which breaks the test, don't know why
    cy.get('[id=\\:r1\\:]').first().type('{backspace}{backspace}{backspace}10') // min age input field
    cy.get('[id=\\:r5\\:]').type('{backspace}{backspace}{backspace}{backspace}{backspace}9') // max age input field
    cy.contains('Min value cannot be higher than max')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').click()
    // make sure the values didn't change
    cy.contains('7.2')
    cy.contains('11.63')
  })
})

describe("Locality's Map works", () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  // note that this changes only dec coordinates, dms is still the old one
  it('Opening map view in edit works', () => {
    cy.visit(`/locality/20920?tab=1`)
    cy.contains('Coordinates')
    cy.get('[id=edit-button]').click()
    cy.contains('Latitude')
    cy.contains('Open Map').click()
    cy.contains('OpenStreetMap')
    cy.contains('Leaflet')

    cy.contains('Save').click()
    cy.contains('OpenStreetMap').should('not.exist')
    cy.contains('Longitude')
    cy.contains('Finalize entry').click()
    cy.contains('Complete and save').click()
    cy.visit(`/locality/20920?tab=1`)
    cy.contains('60.202665856')
    cy.contains('24.957662836')
  })
})

describe('Creating a new locality...', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit('/locality/new/')
    cy.contains('Creating new locality')
    cy.get('[name=dating-method][value=absolute]').click()
    cy.get('[id="Min Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.get('[id="Max Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.get('[id=min_age-textfield]').type('10.23')
    cy.get('[id=max_age-textfield]').type('24.01')
    cy.get('[role=tablist]').contains('Locality').click()
    cy.get('[id=loc_name-textfield]').type('Bugat')
    cy.get('[id=country-textfield]').type('Mongolia')
    cy.get('[id=dec_lat-textfield]').type('49.07')
    cy.get('[id=dec_long-textfield]').type('103.67')
    cy.get('[id=dms_lat-textfield]').should('have.value', '49 4 12 N')
    cy.get('[id=dms_long-textfield]').should('have.value', '103 40 12 E')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').click()
    cy.contains('Edited item successfully.')
    cy.contains('Bugat')
    cy.get('[id=delete-button]').should('exist')
    cy.visit('/locality/')
    cy.contains('Bugat')
  })

  it("with missing country, min basis for age and longitude doesn't work", () => {
    cy.visit('/locality/new/')
    cy.contains('Creating new locality')
    cy.get('[name=dating-method][value=absolute]').click()
    cy.get('[id="Max Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.get('[id=min_age-textfield]').type('11.61')
    cy.get('[id=max_age-textfield]').type('35.22')
    cy.contains('This field is required')
    cy.get('[role=tablist]').contains('Locality').click()
    cy.get('[id=loc_name-textfield]').type('Eg')
    cy.get('[id=dec_lat-textfield]').type('48.68')
    cy.get('[id=dms_lat-textfield]').should('have.value', '48 40 48 N')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
  })
})
