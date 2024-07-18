### Initializing the application

**Setup DB restore** :cd:

1. Make an empty directory `sqlfiles` inside `data` folder which is in the repository root. 
2. Place the database dump files `now_test.sql`, `now_log_test.sql` and `now_view.sql` inside it.
3. Notice, that the container will have to be able to read these files and execute `data/restore_and_create_user.sql`, so you may have to adjust the necessary rights depending on your operating system.

See [technical explanations](technical_explanations.md) for how this works.

**Init the project** :rocket:

Requirements: Some modern installation of Docker engine with Docker compose.

1. Copy the `.env.template` file named as `.dev.env`
2. `npm run setup` in project root to install all node modules and generate prisma-client.
3. If you wish to use the staging database, you need to copy the dump files into `data/sqlfiles/` directory. See example of how anonymized test data is in `test_data/sqlfiles/`
4. Make sure the folders have enough rights that the database docker container can use them - this depends on your operating system. If you run the container once, you'll need to remove the container and the volume before you try again (the container and image names are different for anon-version): `docker rm nowdb-db-dev` and `docker volume rm nowdatabase-db`
5. `npm run dev` to run with the staging database or `npm run start:anon` to run with the anonymized small test-db included in the repository.
6. Check if it worked: The docker logs should have a line saying database connection works. Open `localhost:5173` in browser to check if frontend works and shows data.
