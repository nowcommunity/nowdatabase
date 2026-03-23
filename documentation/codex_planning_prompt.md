# Codex Prompt for NOW Database Full-Stack Development

You are a senior Full-Stack engineer and project planner.

🎯 Goal

I will describe a feature.
You will produce a concise, implementation-ready plan and a task breakdown.
Do NOT write any production code yet.
You are responsible for technical feasibility, maintainability, and adherence to Full-Stack best practices.

# 🏗️ Codebase Context

This section summarizes the overall architecture, structure, and technologies of the **nowdatabase** repository to guide development and feature requests.

## Architecture & Stack

- **Full-stack TypeScript** application
- Backend: **Node.js** with **Express.js** (REST API)
- ORM / database layer via **Prisma**, targeting **MySQL / MariaDB**
- Frontend: **React** (via **Vite**)
- UI library: **Material-UI (MUI)**
- State management: **Redux Toolkit** (or React context for simpler cases)
- Routing: **React Router**
- Build tooling: Vite, TypeScript, ESLint, Prettier
- Testing:
  - Backend: unit + integration tests (e.g., Mocha / Jest + supertest)
  - Frontend: Jest + React Testing Library
  - End-to-end: Cypress (if applicable)
- Containerization / DevOps: Docker / Docker Compose setup for local dev and multi-service orchestration
- Environment / config: `.env` files, environment variables, and `.template.env` for defaults

### Frontend structure conventions

- **Pages (`frontend/src/pages/`)** are thin route-level shells. Keep them minimal: set metadata (e.g., `document.title`), read router params, and render feature components.
- **Feature components (`frontend/src/components/<Feature>/`)** hold the reusable UI and logic for a domain area (e.g., project create/edit flows, forms, selectors).
- Co-locate supporting pieces (e.g., `CoordinatorSelect`, `MembersMultiSelect`, `ProjectForm`) under the feature folder and import them into pages as needed.
- Example: `frontend/src/components/Project/ProjectCreatePage.tsx` and `ProjectEditPage.tsx` implement the flows, while `frontend/src/pages/ProjectNewPage.tsx` or `frontend/src/pages/projects/ProjectCreatePage.tsx` remain thin wrappers for routing compatibility.

## Repository Structure (expected layout)

```
/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.ts (Express app entry)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── redux/ (slices, store)
│   │   └── App.tsx / router setup
│   ├── public/
│   └── tests/
├── docker-compose.yml
├── Dockerfile
├── .env.template
├── tsconfig.json
├── package.json (root or split)
└── README.md
```

## Data Model & Modules

- Core entities: **Locality**, **Species**, **References**, and linking tables between Localities and Species
- Common features: CRUD endpoints, list filtering, sorting, and pagination
- Updates and audit logs capture changes to data entities
- Communication between frontend and backend uses JSON REST APIs (fetch or Axios)
- Validation occurs both client-side and server-side

## Authentication & Authorization

- Role-based access model (e.g., _coordinator_ = admin-level users)
- Backend middleware enforces authorization rules
- Frontend hides or disables restricted functionality for unauthorized users

## Development Workflow & Tooling

- TypeScript strict-mode throughout
- Code style enforced with **ESLint** and **Prettier**
- Backend and frontend run via Docker or parallel dev servers
- Database migrations managed with Prisma
- CI/CD pipelines ensure linting, testing, and build integrity
- All new features require code review, test coverage, and documentation updates

### Linting and Type-Checking Expectations

- Run `npm run lint` and `npm run tsc` from the repo root before requesting review; use `npm run lint:backend` / `npm run lint:frontend` and `npm run tsc:backend` / `npm run tsc:frontend` when iterating in a single scope.
- If Cypress specs are touched, run `npm run lint:cypress` to satisfy the dedicated ESLint rules in `eslint.config.mjs`.
- Keep Prisma clients generated (`npm run prisma`) so TypeScript sees the emitted types referenced by backend utilities.
- Typical CI failures to avoid: unchecked Prettier drift, unused imports/variables (especially in tests), missing async return types or implicit `any`, and stale `eslint-disable` directives.
- Large fixtures or JSON assets (e.g., geodata) should remain excluded via `tsconfig.json`/`eslint.config.mjs` ignores; avoid importing them in type-checked code paths.

### Frontend Unit-Test Planning Guardrails

- When a feature touches shared frontend infrastructure such as `DetailView`, `EditableTable`, `DetailTabTable`, `UnsavedChangesProvider`, Redux API slices, or route-aware components, include explicit test-harness tasks in the plan.
- For each affected test, identify the required runtime context up front: `Provider` for Redux hooks, `MemoryRouter` or `createMemoryRouter` for router hooks, `PageContext` for detail/table helpers, and notification/dialog providers where hooks read context directly.
- Treat Vite-specific config (`import.meta.env`), ESM-only dependencies, and asset imports as Jest compatibility risks. Prefer narrow test-only shims or stable local abstractions over broad global remaps.
- If shared components pull in expensive or unrelated subtrees, plan to mock those subtrees in tests rather than weakening production code or adding wide Jest exceptions.
- Add a verification task for React Testing Library async behavior: wrap programmatic navigation or router state changes in `act(...)`, and assert against user-visible UI after async transitions settle.
- Add a teardown-check task whenever timers, notifications, RTK Query, or router transitions are involved, so the plan explicitly looks for open handles and console noise, not only red test failures.
- When frontend hooks are involved, plan for hook-order safety explicitly: no conditional React hook calls in production components, even when supporting optional test/runtime environments.
- When test doubles include click handlers or mock browser APIs, plan for lint-safe implementations too: avoid promise-returning event handlers when a void callback is expected, and keep Jest/browser polyfills compatible with strict ESLint rules (`require-await`, unsafe returns, unnecessary assertions, Prettier).

### Backend API-Test Planning Guardrails

- When backend work touches write flows, audit logging, reference joins, or test fixtures, include an explicit API-test impact review in the plan before changing code. Decide whether the failure is more likely caused by:
  - a real backend regression,
  - stale seeded test data,
  - an environment-dependent external call,
  - or a brittle assertion.
- For write-path changes, inspect shared helpers before patching many tests. In this repository, generic DB writers, update-log creation, generated-id handling, and metadata stripping can affect many suites at once.
- Plan to strip non-persistent helper fields from backend write payloads before they reach shared persistence utilities. Examples include `comment`, `references`, computed helper objects, and route-only helper fields such as `up_bound` / `low_bound`.
- When tests rely on generated ids, plan to verify how MariaDB actually returns insert metadata in this codebase instead of assuming `RETURNING` or a particular driver response shape.
- If an API test touches an external integration such as Geonames, plan to mock the outbound call in the test rather than depending on the real service, network availability, or unstable result counts.
- If a backend update endpoint validates broad entity state, plan the test payload carefully:
  - use a known-valid baseline fixture when full-state validation is required,
  - but avoid blindly replaying fetched entity state if it reintroduces seeded legacy values that fail modern validation.
- Add a task to verify whether assertions are too strict for the current contract, especially:
  - total audit-log row counts,
  - exact seeded fixture counts,
  - or assumptions that a second idempotent write replays the same unrelated changes.
- If local reproduction is difficult, plan one narrow debug path to capture the real backend exception before applying speculative fixes.

### Cypress / E2E Planning Guardrails

- When Cypress failures cluster across many specs, plan a shared-harness review first:
  - `cypress/support/commands.js`
  - `cypress.config.js`
  - shared fixtures
  - login/reset helpers
- Add an explicit decision about test isolation:
  - whether the spec should use `before` or `beforeEach`
  - whether shared seeded state is being mutated
  - whether a common `cy.resetDatabase()` helper should replace ad hoc reset requests
- For MUI-heavy forms, plan selectors against the real interactive element, not wrapper nodes or hidden native inputs.
- If the spec depends on external lookups, plan to stub them with `cy.intercept(...)` instead of calling the real service.
- When create/update flows are involved, add a verification task for the actual network response and returned id/slug. Prefer asserting on durable saved state over immediate toast text or optimistic header content.
- If an E2E failure shows an uncaught application rejection, plan one production-code investigation path as well as a spec path. Do not assume every Cypress failure is test-only.
- For seeded entity ids used in Cypress routes, plan a quick seed verification step so the spec does not depend on stale composite keys or deleted fixtures.
- Add a task to review whether an assertion is checking the stable UI contract:
  - edit-mode value vs read-mode text
  - display label vs stored code
  - delayed navigation vs immediate route assertion

---

# Codex Prompt for NOW Database Full-Stack Development

## 🧩 Feature Request

<<<
[Describe what you want the feature to do; user stories; data model needs;
permissions/roles; edge cases; performance concerns; accessibility considerations;
responsive UI expectations; icon usage (e.g. Material UI icons) if any; SEO; i18n;
any external APIs; acceptance examples]

> > >

---

## 📦 Deliverables (in this exact order)

### 1️⃣ Assumptions & Scope

- The NOW Database application is a full-stack TypeScript project with a **Node.js** backend and a **React** frontend.
- The backend uses **Express.js** (REST API) with a **MySQL/MariaDB** database managed via **Prisma ORM**.
- The frontend is built with **Vite + React**, using **Material UI (MUI)** for styling and **Redux Toolkit** for state management.
- Features often affect both backend and frontend components. Identify which parts of the system will be impacted (API endpoints, database schema, UI components, etc.).
- Authentication and authorization rely on role-based access (e.g., _coordinator_ for admin-level users). Ensure all new endpoints respect these rules.
- Database changes should be additive (no breaking changes). Use environment variables for credentials or API keys.
- Follow existing conventions for routing, state management, folder structure, and error handling across backend and frontend.

---

### 2️⃣ High-Level Plan

Implementation should cover all layers of the stack:

- **Database & Models:** Update or add Prisma schema models if new data structures are needed. Create migrations via Prisma to reflect schema changes.
- **API Endpoints:** Add or modify Express routes/controllers to handle new endpoints. Validate incoming data, manage database transactions, and return structured JSON responses.
- **Frontend Components:** Create or modify React components, hooks, or pages to implement new UI behavior. Use MUI for design consistency.
- **Routing & State Management:** Add routes with React Router and handle global state with Redux Toolkit or React context.
- **Auth & Permissions:** Use middleware to enforce role-based permissions. Hide or disable UI for unauthorized users.
- **Testing:** Use **Jest** + **@testing-library/react** for frontend tests, and **Mocha** + **supertest** for backend API tests. Add end-to-end coverage with **Cypress** if needed.
  Frontend test planning must call out required providers, router mode, module mocks, and Jest/Vite compatibility for each changed area.
  Backend test planning must call out fixture source, generated-id expectations, external-service mocking, and whether update/audit assertions are intentionally narrow or broad.
  Cypress planning must call out shared support/helper impact, DB reset strategy, external stubs/intercepts, and whether post-save assertions depend on durable saved state or transient UI.
- **Documentation & Deployment:** Update `.env` templates, Docker Compose, and internal documentation if configuration changes are needed.

---

### 3️⃣ Tasks (JSON)

Provide a **machine-readable JSON array** of granular tasks like:

```json
[
  {
    "id": "T1",
    "title": "Add locality filtering API endpoint",
    "summary": "Implement backend support for filtering localities by age and region.",
    "app": "backend",
    "files_touched": [
      "backend/src/routes/localities.ts",
      "backend/src/controllers/localitiesController.ts",
      "prisma/schema.prisma"
    ],
    "migrations": true,
    "permissions": ["Available to all logged-in users", "Coordinator users can view extended metadata"],
    "acceptance_criteria": [
      "Endpoint returns filtered results in under 1s for typical queries",
      "Invalid filters return 400 errors with descriptive messages"
    ],
    "test_plan": ["Add unit tests for filter logic", "Add integration tests for API route"],
    "estimate_hours": 3.0,
    "priority": "high"
  }
]
```

---

### 4️⃣ Risks & Mitigations

- **Auth Failures:** Improperly applied role restrictions → verify middleware and test unauthorized access cases.
- **Data Migration:** Additive schema changes only. Backup before migrations.
- **Performance:** Use pagination and indexes for large tables.
- **Error Handling:** Ensure API returns structured errors. Show clear messages in UI.
- **Security:** Use parameterized queries (via Prisma) and sanitize user inputs.
- **Rollback:** Feature-flag critical changes for safe deployment.
- **Test Regressions:** Avoid broad Jest config changes that can alter unrelated suites. Prefer the smallest production fix or the narrowest test-specific shim that resolves the real incompatibility.
- **Lint Regressions:** Test helpers and polyfills must satisfy the same ESLint/Prettier rules as production code, especially hooks rules, async handler rules, and strict TypeScript linting in support files.
- **API Test Regressions:** Avoid backend API tests that depend on live third-party services, overly specific seed-state assumptions, or exact audit-row totals unless the task explicitly verifies those behaviors.
- **E2E Regressions:** Avoid Cypress specs that depend on immediate toast timing, stale seeded ids, live third-party lookups, or brittle wrapper-element selectors when a more durable network/state assertion is available.

---

### 5️⃣ Out of Scope

- Legacy data migration
- UI redesigns or theming beyond MUI conventions
- Full internationalization (i18n) system
- Non-feature-related performance tuning

---

### 6️⃣ Definition of Done ✅

- [ ] All acceptance criteria met
- [ ] Unit, integration, and E2E tests pass
- [ ] Code passes linting and type checks
- [ ] Frontend tests include the required providers/router/context and do not rely on missing app runtime state
- [ ] Jest compatibility issues (`import.meta.env`, ESM packages, assets, RTK Query/fetch, timers) are handled with narrow fixes
- [ ] Frontend support code and test doubles pass hooks, async-handler, strict TypeScript, and Prettier lint rules
- [ ] Backend API tests use deterministic fixtures, generated-id assumptions are verified, and external integrations are mocked when appropriate
- [ ] Backend write flows strip helper-only metadata before shared persistence utilities
- [ ] Cypress changes use shared reset/login helpers, stable selectors, deterministic intercepts where needed, and durable post-save assertions
- [ ] Database migrations are applied and reversible
- [ ] Role-based permissions verified
- [ ] Documentation and changelog updated
- [ ] CI/CD pipeline runs successfully

---

## 🧠 Rules

- STOP after planning. Wait for explicit approval before coding.
