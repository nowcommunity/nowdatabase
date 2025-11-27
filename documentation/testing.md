## User Testing Instructions

To participate in user testing, please follow the steps below:

1. Use the latest version of the application:  
   [Test Application](https://nowdb-frontend-nowdatabase.ext.ocp-test-0.k8s.it.helsinki.fi/)
2. Perform the listed tasks under typical usage conditions.
3. Note any bugs, usability issues, or unexpected behavior.
4. Submit your feedback via the provided feedback form or issue tracker.

Your feedback is essential to improving the user experience—thank you for participating!

---

## User Testing Tasks

### Cold Tests (No Instructions for Testing)


| Test Case ID | Description | Preconditions | Steps to Execute | Expected Result | 
|--------------|-------------|---------------|------------------|------------------|
| TC01 | Find all localities for species Primus | User is not logged in | No instructions (tests intuitivity) | See a list of Primus with their localities (no map) |
| TC02 | Find all genus that includes "Alopex" | User is not logged in | No instructions | See 9 rows with "Alopex" | 
| TC03 | See localities on a map filtered by country | User is not logged in | No instructions | See filtered localities on a map | 
| TC04 | Take KML export of localities from map | User is not logged in | No instructions | Get KML file downloaded | 
| TC05 | View base map with country boundaries | User is not logged in | No instructions | View simple colored boundary map | 
| TC06 | Info for locality on map | User is not logged in | No instructions | Click marker to view info |
| TC07 | SVG export of map localities | User is not logged in | No instructions | Download SVG file (opens in browser) | 

---

### Instructed Tests


| Test Case ID | Description | Preconditions | Steps to Execute | Expected Result | 
|--------------|-------------|---------------|------------------|------------------|
| TC08 | View localities for species "lynx" | User is not logged in | 1. Go to Cross-search 2. Select species: lynx | See list of lynx localities (2 pages) | 
| TC09 | Full lynx localities listed | User is not logged in | Check that list matches expected | All localities shown accurately | 
| TC10 | View single locality on map via alternative path | User is not logged in | Go to localities page → choose → tab → map | See map with one locality | 
| TC11 | Find localities for Cormohipparion | User is not logged in | Cross-search → filter Genus: "Cormohipparion" | See 3 pages of results | 

---

## Additional Testing Comments (test results can be added here)


| Test Case ID | Pass/Fail if one fails | Comments (1st) 10.6.2025 | Comments (2nd) 10.6.2025 |
|--------------|------------------|----------------------|------------------|
| TC01 | Fail | Meni lokaliteetteihin, ei löydä, yrittää etsiä | Ei avaa Cross-search-hakua |
| TC02 | Pass | | |
| TC03 | Fail | Ei löydä karttaa heti, ei tarpeeksi näkyvästi karttapampula | Ei ollut helposti kartta löydettävissä |
| TC04 | Pass | | |
| TC05 | Pass | Etsi controlleria, löytää lopulta | |
| TC06 | Fail | not ready for testing | |
| TC07 | Pass | Yritti tehdä exportin kartalla, ei mennyt ilman apua | Helppo toiselle |
| TC08 | Pass | | |
| TC09 | — | | |
| TC10 | Fail | Ei tajua painaa search-merkkiä, kesti liian kauan | Symbolin painallus ei riittänyt |
| TC11 | Fail | Haku tyhjensi vastaukset, vaikka käyttö oikein | |

---

## Cypress E2E Tests

### Running the suite

- **Local browsers:** `npm run test:e2e:local` (requires frontend at `http://localhost:5173` and API at `http://localhost:4000`).
- **Headless via Docker (CI parity):** `npm run test:e2e` or `npm run test:ci:e2e` to execute inside the Cypress container image.
- The default spec pattern now includes both `*.cy.*` and `*.spec.*` files under `cypress/e2e`, so the delete flow coverage in `cypress/e2e/delete.spec.ts` runs with the rest of the suite without extra flags.

### Test data and reset steps

- Ensure test configuration is present (`npm run config:test`) and start the test stack (e.g., `docker compose -f docker-compose.dev.yml up`).
- The Cypress env variable `databaseResetUrl` points to `http://localhost:4000/test/reset-test-database` by default. Hitting this endpoint (for example with `curl http://localhost:4000/test/reset-test-database`) resets seeded data before running the suite.
- When running inside Docker, the provided scripts already pass through the defaults; override with `CYPRESS_databaseResetUrl` if the API host/port differs.

