describe('Creating a new locality', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with valid data works', () => {
    cy.visit('/locality/new/')
    cy.contains('Creating new locality')
    cy.get('[name=dating-method]').should('have.value', 'time_unit')
    cy.get('[name=dating-method][value=absolute]').click()
    cy.get('[id="Min Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.contains('other_absolute')

    // test clearing of age fields
    cy.get('[name=dating-method][value=time_unit]').click()
    cy.contains('other_absolute').should('not.exist')
    cy.get('[name=dating-method][value=absolute]').click()
    cy.get('[id="Min Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.get('[id="Max Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.get('[id=min_age-textfield]').type('10.23')
    cy.get('[id=max_age-textfield]').type('24.01')
    cy.get('[role=tablist]').contains('Locality').click()
    cy.get('[id=loc_name-textfield]').type('Bugat')
    cy.contains('Choose a country').parent().type('Mongo')
    cy.contains('Mongolia').click()
    cy.get('[id=dec_lat-textfield]').type('49.07')
    cy.get('[id=dec_long-textfield]').type('103.67')
    cy.get('[id=dms_lat-textfield]').should('have.value', '49 4 12 N')
    cy.get('[id=dms_long-textfield]').should('have.value', '103 40 12 E')
    cy.get('[id=write-button]').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
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
    cy.get('[id=write-button]').should('be.disabled')
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
    cy.contains('4 invalid fields')
  })

  it("and filling, then erasing needed data doesn't work", () => {
    cy.visit('/locality/new/')
    cy.contains('Creating new locality')
    cy.get('[name=dating-method][value=absolute]').click()
    cy.get('[id="Min Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.get('[id="Max Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.get('[id=min_age-textfield]').type('11.61')
    cy.get('[id=max_age-textfield]').type('35.22')

    cy.get('[role=tablist]').contains('Locality').click()
    cy.get('[id=loc_name-textfield]').type('Bugat')
    cy.contains('Choose a country').parent().type('Mongo')
    cy.contains('Mongolia').click()
    cy.get('[id=dec_lat-textfield]').type('49.07')
    cy.get('[id=dec_long-textfield]').type('103.67')
    cy.get('[id=dms_lat-textfield]').should('have.value', '49 4 12 N')
    cy.get('[id=dms_long-textfield]').should('have.value', '103 40 12 E')
    // all required data is provided so the write button is enabled
    cy.get('[id=write-button]').should('not.be.disabled')

    cy.get('[id=dec_lat-textfield]').type('{backspace}{backspace}{backspace}{backspace}{backspace}')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.get('[id=dec_lat-textfield]').type('49.07')
    cy.get('[id=write-button]').should('not.be.disabled')

    cy.get('[role=tablist]').contains('Age').click()
    cy.get('[id=min_age-textfield]').type('{backspace}{backspace}{backspace}{backspace}{backspace}')
    cy.contains('This field is required')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('1 invalid field')

    // make sure errors in other tabs disable the write button
    cy.get('[role=tablist]').contains('Locality').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('1 invalid field')
  })

  it('write button is disabled if unvisited tab has validation errors', () => {
    cy.visit('/locality/new/')
    cy.contains('Creating new locality')
    cy.get('[name=dating-method][value=absolute]').click()
    cy.get('[id="Min Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.get('[id="Max Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=other_absolute]').click()
    cy.get('[id=min_age-textfield]').type('11.61')
    cy.get('[id=max_age-textfield]').type('35.22')

    // Age tab has no errors, but Locality tab has unfilled mandatory fields
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('6 invalid fields')
    cy.get('[id=min_age-textfield-helper-text]').should('not.exist')
    cy.get('[id=max_age-textfield-helper-text]').should('not.exist')
    cy.get('[role=tablist]').contains('Locality').click()
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('6 invalid fields')
  })

  it('composite dating method works', () => {
    cy.visit('/locality/new')
    cy.get('[name=dating-method][value=composite]').click()
    cy.get('[id=bfa_min-tableselection-helper-text]').contains(
      'One age row must follow the rules for Absolute, the other for Time Unit'
    )
    cy.get('[id="Max Basis for age (absolute)-multiselect"]').click()
    cy.get('[data-value=chemical]').click()
    cy.get('[id=max_age-textfield]').type('12.3')
    cy.get('[id=bfa_min-tableselection-helper-text]').contains('This field is required')
    cy.get('[id="Min Basis for age (absolute)-multiselect"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[id=bfa_max-tableselection]').should('be.disabled')
    cy.get('[id="Maximum fraction-multiselect"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value="2:3"]').click()
    cy.get('[id=bfa_min-tableselection]').click()
    cy.get('[data-cy=detailview-button-bahean]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '8.676666666666668')

    cy.get('[role=tablist]').contains('Locality').click()
    cy.get('[id=loc_name-textfield]').type('Bugat')
    cy.contains('Choose a country').parent().type('Mongo')
    cy.contains('Mongolia').click()
    cy.get('[id=dec_lat-textfield]').type('49.07')
    cy.get('[id=dec_long-textfield]').type('103.67')
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()

    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').should('not.be.disabled')
    cy.get('[id=write-button]').click()

    cy.contains('Edited item successfully.')
    cy.contains('Bugat')
    cy.contains('8.676')
    cy.get('[id=delete-button]').should('exist')
    cy.visit('/locality/')
    cy.contains('Bugat')
  })

  it('selecting fractions and basis for age updates the age correctly', () => {
    cy.visit('/locality/new')
    cy.get('[id=bfa_min-tableselection]').click()
    cy.get('[data-cy=detailview-button-bahean]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '7.2')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value="1:2"]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '9.415000000000001')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value="2:2"]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '7.2')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value="2:3"]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '8.676666666666668')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value=""]').click() // No value option
    cy.get('[id=min_age-textfield]').should('have.value', '7.2')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value="1:2"]').click()
    cy.get('[id=bfa_min-tableselection]').click()
    cy.get('[data-cy=detailview-button-langhian]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '14.895')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value=""]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '13.82')

    cy.get('[id=bfa_max-tableselection]').click()
    cy.get('[data-cy=detailview-button-bahean]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '11.63')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value="2:2"]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '9.415000000000001')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value="1:2"]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '11.63')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value="2:3"]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '10.153333333333334')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value=""]').click() // No value option
    cy.get('[id=max_age-textfield]').should('have.value', '11.63')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value="2:2"]').click()
    cy.get('[id=bfa_max-tableselection]').click()
    cy.get('[data-cy=detailview-button-langhian]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '14.895')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value=""]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '15.97')
  })
})

describe('Editing a locality', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('with contradictory min and max ages does not work', () => {
    cy.visit(`/locality/20920?tab=0`)
    cy.contains('Lantian-Shuijiazui')
    cy.get('[id=edit-button]').click()
    cy.get('[name=dating-method][value=absolute]').click()
    cy.get('[id=min_age-textfield]').first().type('{backspace}{backspace}{backspace}10')
    cy.get('[id=max_age-textfield]').type('{backspace}{backspace}{backspace}{backspace}{backspace}9')
    cy.contains('Min value cannot be higher than max')
    cy.get('[id=write-button]').should('be.disabled')
    cy.contains('4 invalid fields')
  })

  it('changing fractions and basis for age updates the age correctly', () => {
    cy.visit(`/locality/20920?tab=0`)
    cy.get('[id=edit-button]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '7.2')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value="1:2"]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '9.415000000000001')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value="2:2"]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '7.2')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value="2:3"]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '8.676666666666668')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value=""]').click() // No value option
    cy.get('[id=min_age-textfield]').should('have.value', '7.2')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value="1:2"]').click()
    cy.get('[id=bfa_min-tableselection]').click()
    cy.get('[data-cy=detailview-button-langhian]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '14.895')
    cy.get('[id="Minimum fraction-multiselect"]').click()
    cy.get('[data-value=""]').click()
    cy.get('[id=min_age-textfield]').should('have.value', '13.82')

    cy.get('[id=max_age-textfield]').should('have.value', '11.63')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value="2:2"]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '9.415000000000001')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value="1:2"]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '11.63')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value="2:3"]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '10.153333333333334')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value=""]').click() // No value option
    cy.get('[id=max_age-textfield]').should('have.value', '11.63')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value="2:2"]').click()
    cy.get('[id=bfa_max-tableselection]').click()
    cy.get('[data-cy=detailview-button-langhian]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '14.895')
    cy.get('[id="Maximum fraction-multiselect"]').click()
    cy.get('[data-value=""]').click()
    cy.get('[id=max_age-textfield]').should('have.value', '15.97')
  })
})

// This test needs GEONAMES_USERNAME to be set in .anon.env!

describe("Locality's coordinate selection map works", () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('Map view and location search work', () => {
    cy.visit(`/locality/20920?tab=1`)
    cy.get('[id=edit-button]').click()
    cy.contains('Choose a country').parent().type('Finland')
    cy.contains('Finland').click()
    cy.contains('Get Coordinates').click()
    cy.contains('OpenStreetMap')
    cy.contains('Leaflet')
    cy.get('[alt="Marker"]').should('have.attr', 'src').should('include', 'marker-icon.png')
    cy.get('[id=geonames-search-textfield]').type('kum')
    cy.get('[id=geonames-search-button]').should('not.be.disabled')
    cy.get('[id=geonames-search-textfield]').type('{backspace}{backspace}{backspace}')
    cy.get('[id=geonames-search-button]').should('be.disabled')
    cy.get('[id=geonames-search-textfield]').type('abcdefg')
    cy.get('[id=geonames-search-button]').click()
    cy.contains('No results found')
    cy.get('[id=geonames-search-textfield]').clear()
    cy.get('[id=geonames-search-textfield]').type('Kumpula')
    cy.get('[id=geonames-search-textfield]').type('{enter}')
    cy.contains('Central Finland').first().click() // first item on the list
    cy.contains('Latitude: 63.05484, Longitude: 24.75291')
    cy.contains('Save').click()
    cy.contains('Finalize entry').click()
    cy.contains('button', 'Add existing reference').click()
    cy.get('button[data-cy^="detailview-button"]').first().click()
    cy.contains('button', 'Close').click()
    cy.get('[id=write-button]').click()
    cy.visit(`/locality/20920?tab=1`)
    cy.contains('63.05484')
    cy.contains('24.75291')
    cy.contains('63 3 17 N')
    cy.contains('24 45 10 E')
  })
})

describe('Deleting a locality', () => {
  beforeEach('Login as admin', () => {
    cy.login('testSu')
  })

  it('works and returns user to table view', () => {
    cy.visit(`/locality/20920`)
    cy.contains('Lantian-Shuijiazui')
    cy.get('[id=delete-button]').should('exist').click()
    cy.on('window:confirm', str => {
      expect(str).to.eq('Are you sure you want to delete this item? This operation cannot be undone.')
      // this automatically clicks the OK button and returns to table view
    })
    cy.contains('Dmanisi') // check that table view has been navigated to
    cy.contains('Lantian-Shuijiazui').should('not.exist')
    cy.visit(`/locality/20920`)
    cy.contains('Error loading data')
  })
})
