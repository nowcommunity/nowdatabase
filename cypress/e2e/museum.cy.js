const buildMuseumCode = prefix => {
  const suffix = String(Date.now()).slice(-4)
  return `${prefix}${suffix}`.slice(0, 10)
}

const fillMuseumForm = ({ code, institution, city, country, altName, state, stateCode }) => {
  cy.get('#institution-textfield').clear()
  cy.get('#institution-textfield').type(institution)
  cy.get('#city-textfield').clear()
  cy.get('#city-textfield').type(city)
  cy.get('#museum-textfield').clear()
  cy.get('#museum-textfield').type(code)

  cy.get('#Country-multiselect input').clear()
  cy.get('#Country-multiselect input').type(`${country}{enter}`)

  if (altName !== undefined) {
    cy.get('#alt_int_name-textfield').clear()
    cy.get('#alt_int_name-textfield').type(altName)
  }

  if (state !== undefined) {
    cy.get('#state-textfield').clear()
    cy.get('#state-textfield').type(state)
  }

  if (stateCode !== undefined) {
    cy.get('#state_code-textfield').clear()
    cy.get('#state_code-textfield').type(stateCode)
  }
}

const fillCreateMuseumModal = ({ code, institution, city, country, altName, state, stateCode }) => {
  cy.get('input[name="institution"]').clear()
  cy.get('input[name="institution"]').type(institution)
  cy.get('input[name="alt_int_name"]').clear()
  cy.get('input[name="alt_int_name"]').type(altName ?? '')
  cy.get('input[name="city"]').clear()
  cy.get('input[name="city"]').type(city)

  cy.contains('label', 'Country').parent().as('countryField')
  cy.get('@countryField').find('[role="button"]').click()
  cy.contains('li', country).click()

  cy.get('input[name="state"]').clear()
  cy.get('input[name="state"]').type(state ?? '')
  cy.get('input[name="state_code"]').clear()
  cy.get('input[name="state_code"]').type(stateCode ?? '')
  cy.get('input[name="museum"]').clear()
  cy.get('input[name="museum"]').type(code)
}

before(() => {
  cy.resetDatabase()
})

describe('Museum e2e flows', () => {
  beforeEach(() => {
    cy.loginWithSession('testSu')
  })

  it('shows museum list for authorized users', () => {
    cy.visit('/museum')
    cy.get('[data-cy="details-button-AM"]').should('be.visible')
    cy.contains('Australian Museum').should('be.visible')
  })

  it('creates a new museum and lands on its details view', () => {
    const code = buildMuseumCode('MT')
    const institution = `Museum Test ${code}`
    const city = 'Helsinki'
    const country = 'Finland'

    cy.intercept('PUT', '**/museum').as('saveMuseum')

    cy.visit('/museum/new')
    fillMuseumForm({ code, institution, city, country })

    cy.get('[id=write-button]').click()
    cy.wait('@saveMuseum').its('response.statusCode').should('eq', 200)

    cy.location('pathname').should('eq', `/museum/${code}`)
    cy.contains(institution).should('be.visible')
    cy.contains(city).should('be.visible')
    cy.contains(country).should('be.visible')
  })

  it('edits an existing museum and persists changes', () => {
    const altName = `Alt name ${Date.now()}`

    cy.intercept('PUT', '**/museum').as('saveMuseum')

    cy.visit('/museum/AM')
    cy.get('[id=edit-button]').click()
    cy.get('#alt_int_name-textfield').clear()
    cy.get('#alt_int_name-textfield').type(altName)

    cy.get('[id=write-button]').click()
    cy.wait('@saveMuseum').its('response.statusCode').should('eq', 200)

    cy.contains(altName).should('be.visible')
  })

  it('links an existing museum to a locality and saves the locality', () => {
    cy.intercept('PUT', '**/locality').as('saveLocality')

    cy.visit('/locality/20920?tab=9')
    cy.get('[id=edit-button]').click()

    cy.contains('Select Museum').click()
    cy.get('[data-cy="add-button-AM"]').click()
    cy.contains('Australian Museum').should('be.visible')
    cy.contains('button', 'Close').click()

    cy.addReferenceAndSave()
    cy.wait('@saveLocality').its('response.statusCode').should('eq', 200)

    cy.visit('/locality/20920?tab=9')
    cy.contains('Australian Museum').should('be.visible')
  })

  it('creates a museum from the locality modal and links it', () => {
    const code = buildMuseumCode('LM')
    const institution = `Locality Museum ${code}`
    const city = 'Turku'
    const country = 'Finland'

    cy.intercept('PUT', '**/museum').as('saveMuseum')
    cy.intercept('PUT', '**/locality').as('saveLocality')

    cy.visit('/locality/20920?tab=9')
    cy.get('[id=edit-button]').click()

    cy.contains('Create Museum').click()
    fillCreateMuseumModal({ code, institution, city, country })
    cy.contains('button', 'Save').click()

    cy.wait('@saveMuseum').its('response.statusCode').should('eq', 200)
    cy.contains(institution).should('be.visible')

    cy.addReferenceAndSave()
    cy.wait('@saveLocality').its('response.statusCode').should('eq', 200)

    cy.visit('/locality/20920?tab=9')
    cy.contains(institution).should('be.visible')
  })
})
