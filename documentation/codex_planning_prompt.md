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

- Role-based access model (e.g., *coordinator* = admin-level users)  
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

---

# Codex Prompt for NOW Database Full-Stack Development

## 🧩 Feature Request
<<<
[Describe what you want the feature to do; user stories; data model needs; 
permissions/roles; edge cases; performance concerns; accessibility considerations; 
responsive UI expectations; icon usage (e.g. Material UI icons) if any; SEO; i18n; 
any external APIs; acceptance examples]
>>>

---

## 📦 Deliverables (in this exact order)

### 1️⃣ Assumptions & Scope
- The NOW Database application is a full-stack TypeScript project with a **Node.js** backend and a **React** frontend. 
- The backend uses **Express.js** (REST API) with a **MySQL/MariaDB** database managed via **Prisma ORM**.
- The frontend is built with **Vite + React**, using **Material UI (MUI)** for styling and **Redux Toolkit** for state management.
- Features often affect both backend and frontend components. Identify which parts of the system will be impacted (API endpoints, database schema, UI components, etc.).
- Authentication and authorization rely on role-based access (e.g., *coordinator* for admin-level users). Ensure all new endpoints respect these rules.
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
    "permissions": [
      "Available to all logged-in users",
      "Coordinator users can view extended metadata"
    ],
    "acceptance_criteria": [
      "Endpoint returns filtered results in under 1s for typical queries",
      "Invalid filters return 400 errors with descriptive messages"
    ],
    "test_plan": [
      "Add unit tests for filter logic",
      "Add integration tests for API route"
    ],
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
- [ ] Database migrations are applied and reversible
- [ ] Role-based permissions verified
- [ ] Documentation and changelog updated
- [ ] CI/CD pipeline runs successfully

---

## 🧠 Rules
- STOP after planning. Wait for explicit approval before coding.
