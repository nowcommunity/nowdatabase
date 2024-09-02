### Contributing and CI / CD

**Contributing workflow**
+ Commit code to some branch, preferably other than `main`. Once the test workflows all pass, and preferably someone else reviews your code, you can make a pull request to main and merge it.

**Tests & linting**

Dynamic tests
+ End-to-end tests with cypress
  + `cypress` folder in the repository root
  + Main purpose is to check that mostly correct things are being shown and that views don't crash. Feel free to implement more of these.
  + To run, have the anon-version running, then in repo root type `npm run test:e2e` to run in headless mode, or to see the tests running type `npm run cypress open`.
+ API-tests using node test runner
  + `backend/src/api-tests` folder. Runs tests whose filename match `*.test.ts`.
  + More critical features should have api-tests, such as write & logging operations as well as user access.
  + To run, type `npm run test:api` in repo root. These tests edit the database and assume that on each run the database is in initial state, so after running the tests or editing it yourself, you must reset it before running the tests again: `npm run reset-anon-db`

Static tests
+ TypeScript compiler
  + Checks the basic TypeScript correctness with settings configured in tsconfig-files
+ ESLint checks
  + More code quality checks, also related to code style, configured by `.eslintrc.cjs` files
+ To run both static checks in both `frontend` and `backend`, do `npm run check`. Notice that this runs the commands sequentially and will stop at errors; so after fixing one error you must always run again and it may find other errors.

**GitHub Actions workflows**
+ Linting and tsc is ran in GitHub Actions on push and pull request to any branch.
+ End-to-end tests are ran in GitHub as well. They use anonymous data. 

**Deployment**
+ Any code pushes to `main`-branch will trigger the `build` workflow. This will build the docker images (staging-version) and push them to GitHub image registry. Staging-OpenShift will then notice this once every 15 minutes, pull the images, and deploy them to staging. Though now there is a bug in OpenShift which prevents this so you must trigger the image update there yourself.
+ Production versions are built & deployed whenever you create a Release.

**Naming conventions**
+ Types, React-components, classes: `PascalCase`
+ Field names that come directly from database columns or tables are the same name as in the db: `snake_case`
+ Environment variables: `SCREAMING_SNAKE_CASE`
+ Everything else - variables, functions etc: `camelCase`
