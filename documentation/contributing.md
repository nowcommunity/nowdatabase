### Contributing and CI / CD

**Contributing**
+ Commits can be freely made to `development` branch, but it is safer to use another branch and then make a pull request to merge in development.

**Tests**
+ Pre-commit hook lints and tests typescript compilation before every commit. 
  + This can be bypassed by adding "--no-verify" as argument to the commit command.

Dynamic tests to be built later.

**Deployment**
+ Code can be merged to `main`-branch once it is tested in development.
+ Code is deployed from `main`. Currently requires building both images in OpenShift.