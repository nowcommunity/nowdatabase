### Github actions

This project utilizes Github actions for linting, testing and building the project. At the moment
pull requests cannot be merged if the all of the pull-request-actions do not pass.

The following actions are run on every pull request:

- `lint.yaml`
  - Lints the whole project and fails if there is linting issues
- `api-tests.yaml`
  - Runs api tests inside Docker, passes if all tests pass
- `e2e.yaml`
  - Runs e2e tests inside Docker, passes if all tests pass
- `unit-tests.yaml`
  - Runs all unit tests, passes if all tests pass

And the following are run on only merges to main:

- `build.yaml`
  - Builds staging version of both backend and frontend and creates Github package out of
    both of them. If the triggering event happens to be a release, a production package is made.
- `phpmyadmin.yaml`
  - Builds the patched phpMyAdmin image and creates a Github package
