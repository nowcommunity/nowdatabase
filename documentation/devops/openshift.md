### Openshift

Staging and production is deployed in Openshift. You should read more about Openshift's own documentation
and Kubernetes documentation to understand more.

#### Updating deployments

Auto-deploying pods when new images are pulled from Github doesn't work at the moment because of
a bug in Openshift. Until it is fixed the deployments have to be updated manually.

1. Select role as developer if there is an option. Otherwise skip this.
2. Go to `Topology`
3. Select backend or frontend
4. From `Actions` dropdown menu select "`Edit Deployment`"
5. Select `Form view` if not selected.
6. Tick `Auto deploy when new Image is available`
7. Save

If there was a new version of an image, a new pod should be created and the old one destroyed after
the new pod is up and running.

Same goes for production.

Trying to update the staging right after merging a pull request might not always work because
Openshift pulls the new image from Github packages roughly every 15mins.
