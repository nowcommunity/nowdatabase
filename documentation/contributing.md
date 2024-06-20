### Contributing and CI / CD

**Contributing**
+ Make commits in some new branches - for example a specific feature. If you make more general changes you can use `development`. Merge/rebase, or make a pull request to main once ready and tests pass.

**Tests**
+ Linting and tsc is ran in GitHub Actions on push and pull request to any branch.
+ End-to-end tests are ran in GitHub as well. They use anonymous data. 

**Deployment**
+ Code is deployed from `main`. Currently requires building both images in OpenShift manually.

**Naming conventions**
+ Types, React-components: `PascalCase`
+ Field names that come directly from database columns or tables: `snake_case`
+ Everything else - variables, functions etc: `camelCase`
