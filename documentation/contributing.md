### Contributing and CI / CD

**Contributing**
+ Make commits in some new branches - for example a specific feature. If you make more general changes you can use `development`. Merge/rebase, or make a pull request to main once ready and tests pass.

**Tests**
+ Linting and tsc is ran in GitHub actions on push and pull request to any branch.
+ Run locally by doing `npm run lint` and `npx tsc --noEmit` in both `frontend` and `backend` folders.s

**Deployment**
+ Code is deployed from `main`. Currently requires building both images in OpenShift manually.