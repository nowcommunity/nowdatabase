const buildMuseumCode = prefix => {
  const suffix = String(Date.now()).slice(-4)
  return `${prefix}${suffix}`.slice(0, 10)
}

const typeIfNotEmpty = (selector, value) => {
  if (value === undefined || value === null || value === '') {
    return
  }
  cy.get(selector).clear()
  cy.get(selector).type(value)
}

const openMuseumFromList = (institution, code) => {
  cy.visit('/museum')
  cy.get('[aria-label="Filter by Institution"]', { timeout: 10000 }).clear()
  cy.get('[aria-label="Filter by Institution"]').type(institution)
  cy.contains('td', institution, { timeout: 10000 })
    .should('be.visible')
    .closest('tr')
    .within(() => {
      cy.get(`[data-cy="details-button-${code}"]`).click()
    })
}

const fillMuseumForm = ({ code, institution, city, country, altName, state, stateCode }) => {
  typeIfNotEmpty('#institution-textfield', institution)
  typeIfNotEmpty('#city-textfield', city)
  typeIfNotEmpty('#museum-textfield', code)

  cy.contains('Choose a country', { timeout: 10000 }).parent().type(`${country}{enter}`)

  typeIfNotEmpty('#alt_int_name-textfield', altName)
  typeIfNotEmpty('#state-textfield', state)
  typeIfNotEmpty('#state_code-textfield', stateCode)
}

const fillCreateMuseumModal = ({ code, institution, city, country, altName, state, stateCode }) => {
  typeIfNotEmpty('input[name="institution"]', institution)
  typeIfNotEmpty('input[name="alt_int_name"]', altName)
  typeIfNotEmpty('input[name="city"]', city)

  cy.get('input[name="country"]').parent().as('countryField')
  cy.get('@countryField').find('[role="button"]').click()
  cy.contains('li', country).click()

  typeIfNotEmpty('input[name="state"]', state)
  typeIfNotEmpty('input[name="state_code"]', stateCode)
  typeIfNotEmpty('input[name="museum"]', code)
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
    cy.get('[aria-label="Filter by Institution"]', { timeout: 10000 }).clear()
    cy.get('[aria-label="Filter by Institution"]').type('Australian Museum')
    cy.contains('td', 'Australian Museum', { timeout: 10000 })
      .should('be.visible')
      .closest('tr')
      .within(() => {
        cy.get('[data-cy="details-button-AM"]').should('be.visible')
      })
  })

  it('creates a new museum and lands on its details view', () => {
    const code = buildMuseumCode('MT')
    const institution = `Museum Test ${code}`
    const city = 'Helsinki'
    const country = 'Finland'

    cy.intercept('PUT', '**/museum').as('saveMuseum')

    cy.visit('/museum/new')
    cy.get('#institution-textfield', { timeout: 10000 }).should('be.visible')
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

    openMuseumFromList('Australian Museum', 'AM')
    cy.contains('Australian Museum', { timeout: 10000 }).should('be.visible')
    cy.get('[id=edit-button]').should('be.visible').click()
    typeIfNotEmpty('#alt_int_name-textfield', altName)

    cy.get('[id=write-button]').click()
    cy.wait('@saveMuseum').its('response.statusCode').should('eq', 200)

    cy.contains(altName).should('be.visible')
  })

  it('links an existing museum to a locality and saves the locality', () => {
    cy.intercept('PUT', '**/locality').as('saveLocality')

    cy.visit('/locality/20920?tab=9')
    cy.get('[id=edit-button]').click()

    cy.contains('Select Museum').click()
    cy.get('[aria-label="Filter by Institution"]', { timeout: 10000 }).clear()
    cy.get('[aria-label="Filter by Institution"]').type('Australian Museum')
    cy.get('[data-cy="add-button-AM"]', { timeout: 10000 }).should('be.visible').click()
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
