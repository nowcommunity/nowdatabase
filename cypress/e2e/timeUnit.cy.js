describe("Editing time unit", () => {
    beforeEach('Login as admin', () => {
        cy.login('testSu')
    })
    beforeEach('Reset database', () => {
        cy.request(Cypress.env("databaseResetUrl"));
    });
    it.skip("User editing time unit with correct values succeeds", () => {
        cy.visit(`/time-unit/bahean?tab=0`)
        cy.contains('Bahean')
        cy.get('[id=edit-button]').click()
        // this id might change which breaks the test, don't know why
        cy.get("[id=\\:r1\\:]").first().type("{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}")
        cy.contains("This field is required")
        cy.get('[id=write-button]').click()
        cy.get('[id=write-button]').click()
        cy.contains("Bahean")
    })
    it.skip("User editing time unit with incorrect values is notified about it", () => {
        cy.visit(`/time-unit/bahean?tab=0`)
        cy.contains('Bahean')
        cy.get('[id=edit-button]').click()
        cy.get("[id=\\:r7\\:]").first().click()
        cy.get("[data-cy=detailview-button-ALMAAsianlandmammalage]").first().click()
        cy.contains("ALMAAsianlandmammalage")
        cy.get('[id=write-button]').click()
        cy.get('[id=write-button]').click()
        cy.contains("ALMAAsianlandmammalage")
    })
})
