describe("Editing time bound", () => {
    beforeEach('Login as admin', () => {
        cy.login('testSu')
    })
    beforeEach('Reset database', () => {
        cy.request(Cypress.env("databaseResetUrl"));
    });
    it("User editing time bound with correct values succeeds", () => {
        cy.visit(`/time-bound/11?tab=0`)
        cy.contains('C2N-y')
        cy.get('[id=edit-button]').click()
        // this id might change which breaks the test, don't know why
        cy.get("[id=\\:r1\\:]").first().type("{backspace}{backspace}{backspace}{backspace}{backspace}2.5")
        cy.contains("This field is required").should('not.exist')
        cy.get('[id=write-button]').click()
        cy.get('[id=write-button]').click()
        cy.contains("2.5")
    })
    it("User editing time bound with incorrect values is notified about it", () => {
        cy.visit(`/time-bound/11?tab=0`)
        cy.contains('C2N-y')
        cy.get('[id=edit-button]').click()
        // this id might change which breaks the test, don't know why
        cy.get("[id=\\:r1\\:]").first().type("{backspace}{backspace}{backspace}{backspace}{backspace}")
        cy.contains("This field is required")
        cy.get('[id=write-button]').click()
        cy.get('[id=write-button]').click()
        // make sure the age value didn't change
        cy.contains("1.778")
    })
})
