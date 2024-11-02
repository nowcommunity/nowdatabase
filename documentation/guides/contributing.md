### Contributing and CI / CD

**Contributing workflow**
+ See an issue on Github Issues or Projects tab that you want to fix/implement.
+ Assign the issue to yourself and start work on the issue on a new local branch. *REMEMBER TO PULL MAIN BEFORE CREATING THE BRANCH!* Just for your own sake.
+ Move the task on Github Projects to "In progress".
+ Work on the task on hand while making small commits along the way.
+ Finish work? Remember to check if all tests still pass!
+ Test passing, it's now time to push the changes to a new branch on Github and create a pull request to main.
+ Now wait for all of the checks to pass (and fixing them if they do not pass) and then it's a waiting game for someone else to approve the pull request.
+ When merged you can safely delete the local branch, pull main and admire your work.
+ Don't forget to close your issue and to tag the pull request in the issue by just adding #PR_NUMBER. Also move the task on GH Projects to "Done".
+ Repeat.

**Backlog and taskboard**
This is for contributors that have access to the nowdatabase Github Project.

Creating issues.

+ Come up with a feature / find a bug
+ In case of a feature, write an user story for it. / Bugs => Write an issue that clearly describes what happens, when it happens and under what circumstances it happens.
+ Create an issue to nowdatabase repo that has the user story / short description of the bug as the title.
+ Next think of smaller tasks that need to be done in order to implement the wanted feature / fix the bug. Don't forget to add tests as a task!
+ Now create issues for those tasks too. If there is relevant information regarding the task, it can be written to the description or added as a comment under the issue. *Hint, take note of the issue numbers that Github automatically assigns.*
+ Create a checkbox by typing `- [ ]` and link the tasks to the user story / bug issue by referencing the issue by it's number: `#1234`. With the example issue number we would get: `- [ ] #1234`.

Now the issue is ready for the backlog and the taskboard.

+ Open the original user story / bug issue and look to the menu on the right and find a section `Projects` and under that `nowdatabase`.
+ Click on the arrow that expands the view to include all of the fields available on the Github Project. _Don't go to the Github Projects website yet._
+ Set the priority, size and category according to the issue at hand.
+ Do this for all tasks listed in the issue.
+ After that all of the issues should end up to the Github Project `nowdatabase`. All of the issues should be seen on the `Product backlog`, User storys on `Backlog` and Tasks on `Taskboard`.

During sprint planning.

+ In `Backlog` move all of the selected user stories to `Sprint Backlog` and set the `Iteration` field to the current sprint.
+ Do this also for all of the tasks and bug reports.

Handling the Project while developing.

+ When you start work on an user story / bug, change the matching entries on `Backlog` and `Taskboard` to `In Progress`. You can also assign the user story / bug / task to yourself by clicking on the entry and by selecting yourself on the `Assignees` field on the right.
+ When you finish a task, move it straght to `Done`.
+ User story can be moved to `Done` when all of the tasks and tests are done for that story.
+ All user stories that have been demoed approved by the client are moved to the `Approved`


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
