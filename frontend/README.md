# Frontend QA Notes

## Regression Checklist

### Update log return navigation
Ensure the "Return to table" button in detail views respects the originating Update log context.

**Manual verification**
1. Launch the full stack (API + frontend) and seed data containing Update log entries.
2. In the UI, open any entity detail panel (e.g., Locality → Updates → Details).
3. Follow a "References → View" link; the reference detail page should render.
4. Press **Return to table** and confirm you are navigated back to the originating Update log tab, not the Localities table.

**Automated coverage**
- Unit/regression test: `npx jest --runTestsByPath frontend/tests/updateLogNavigation.test.tsx`
- End-to-end flow: `npx cypress run --spec cypress/e2e/updateLogNavigation.cy.ts` (requires the application and database running locally).

Record any deviations in the QA log and link failures to the associated test artifacts.
