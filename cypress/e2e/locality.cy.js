describe("Locality min and max age checks work", () => {
    beforeEach('Login as admin', () => {
        cy.login('testSu')
    })

    it.skip("Editing a locality with contradictory min and max ages does not work", () => {
        cy.on("uncaught:exception", (error) => {
            // this is here to ignore the error that happens when you put contradictory data to backend
            // might ignore errors that should not be ignored too!
            console.log(error)
            return false
        })

        cy.visit(`/locality/20920?tab=0`)
        cy.contains('Dating method')
        cy.get('[id=edit-button]').click()
        // the id's for these next two might change which breaks the test, don't know why
        cy.get("[id=\\:r1\\:]").first().type("{backspace}{backspace}{backspace}10") // min age input field
        cy.get("[id=\\:r5\\:]").type("{backspace}{backspace}{backspace}{backspace}{backspace}9") // max age input field
        cy.contains("Min value cannot be higher than max")
        cy.get('[id=write-button]').click()
        cy.get('[id=write-button]').click()
        // make sure the values didn't change
        cy.contains("7.2")
        cy.contains("11.63")
    })
})

// WIP
describe('Locality\'s Map works', () => {
    beforeEach('Login as admin', () => {
        cy.login('testSu')
    })

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
        cy.contains('60.202665856') //breaks here
        cy.contains('24.957662836') //and here
    })
  })