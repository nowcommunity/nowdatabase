# Frontend Test Notes

## Running the suite
- Install dependencies with `npm install` if you have not already.
- Execute `npm run test -- --watch=false` from the `frontend/` directory to run all Jest specs in CI mode.

## Country or Continent filtering coverage
- The Localities and Occurrence tables now accept either a country name or a continent keyword in the "Country or Continent" column filter.
- Automated coverage for the helper logic lives in `src/util/__tests__/countryContinents.test.ts`. Re-run that file directly with `npx jest src/util/__tests__/countryContinents.test.ts` if you need quick feedback while adjusting the mapping.
- When performing manual QA, confirm that entering a continent (for example, "Africa") narrows both tables to countries mapped to that continent and that standard country filters still work as expected.
