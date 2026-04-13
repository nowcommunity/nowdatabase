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
  cy.contains(institution, { timeout: 10000 })
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

  cy.contains('Choose a country', { timeout: 10000 }).parent().type(country)
  cy.get('ul[role="listbox"]', { timeout: 10000 }).contains(country).click()

  typeIfNotEmpty('#alt_int_name-textfield', altName)
  typeIfNotEmpty('#state-textfield', state)
  typeIfNotEmpty('#state_code-textfield', stateCode)
}

  const fillCreateMuseumModal = ({ code, institution, city, country, altName, state, stateCode }) => {
  cy.get('.modal-content').within(() => {
    typeIfNotEmpty('input[name="institution"]', institution)
    typeIfNotEmpty('input[name="alt_int_name"]', altName)
    typeIfNotEmpty('input[name="city"]', city)
    cy.get('#create-museum-country').click({ force: true })
  })

  cy.get('ul[role="listbox"]', { timeout: 10000 }).contains(country).click()

  cy.get('.modal-content').within(() => {
    cy.get('input[name="country"]').should('have.value', country)
    typeIfNotEmpty('input[name="state"]', state)
    if (stateCode !== undefined && stateCode !== null) {
      typeIfNotEmpty('input[name="state_code"]', stateCode)
    } else {
      cy.get('input[name="state_code"]').clear()
      cy.get('input[name="state_code"]').type(' {backspace}')
    }
    typeIfNotEmpty('input[name="museum"]', code)
  })
}

const apiBaseUrl = Cypress.env('apiBaseUrl') ?? 'http://localhost:4000'
let seedMuseum = { code: 'AM', institution: 'Australian Museum' }

before(() => {
  cy.resetDatabase()
  cy.loginWithSession('testSu')
  const code = buildMuseumCode('CYM')
  seedMuseum = { code, institution: `Cypress Museum ${code}` }
  cy.window().then(win => {
    const userState = win.localStorage.getItem('userState')
    const token = userState ? JSON.parse(userState).token : null
    if (!token) {
      throw new Error('Missing auth token for museum setup')
    }
    cy.request({
      method: 'PUT',
      url: `${apiBaseUrl}/museum`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        museum: {
          museum: seedMuseum.code,
          institution: seedMuseum.institution,
          city: 'Helsinki',
          country: 'Finland',
          alt_int_name: '',
          state: '',
          state_code: '',
        },
      },
    })
  })
})

describe('Museum e2e flows', () => {
  beforeEach(() => {
    cy.loginWithSession('testSu')
  })

  it('shows museum list for authorized users', () => {
    cy.visit('/museum')
    cy.get('[aria-label="Filter by Institution"]', { timeout: 10000 }).clear()
    cy.get('[aria-label="Filter by Institution"]').type(seedMuseum.institution)
    cy.contains(seedMuseum.institution, { timeout: 10000 })
      .should('be.visible')
      .closest('tr')
      .within(() => {
        cy.get(`[data-cy="details-button-${seedMuseum.code}"]`).should('be.visible')
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

    cy.get('[id=write-button]').should('not.be.disabled')
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

    openMuseumFromList(seedMuseum.institution, seedMuseum.code)
    cy.contains(seedMuseum.institution, { timeout: 10000 }).should('be.visible')
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
    cy.get('[aria-label="Filter by Institution"]').type(seedMuseum.institution)
    cy.get(`[data-cy="add-button-${seedMuseum.code}"]`, { timeout: 10000 }).should('be.visible').click()
    cy.contains(seedMuseum.institution).should('be.visible')
    cy.contains('button', 'Close').click()

    cy.addReferenceAndSave()
    cy.wait('@saveLocality').its('response.statusCode').should('eq', 200)

    cy.visit('/locality/20920?tab=9')
    cy.contains(seedMuseum.institution).should('be.visible')
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
    fillCreateMuseumModal({ code, institution, city, country, stateCode: '' })
    cy.contains('button', 'Save').click()

    cy.wait('@saveMuseum').then(({ response }) => {
      expect(response?.statusCode).to.eq(200, `Museum create failed: ${JSON.stringify(response?.body)}`)
    })
    cy.contains(institution).should('be.visible')

    cy.addReferenceAndSave()
    cy.wait('@saveLocality').its('response.statusCode').should('eq', 200)

    cy.visit('/locality/20920?tab=9')
    cy.contains(institution).should('be.visible')
  })
})
