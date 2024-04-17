### Initializing the application

**Setup DB restore** :cd:

1. Make an empty directory `sqlfiles` inside `data` folder which is in the repository root. 
2. Place the database dump files `now_test.sql`, `now_log_test.sql` and `now_view.sql` inside it.
3. Notice, that the container will have to be able to read these files and execute `data/restore_and_create_user.sql`, so you may have to adjust the necessary rights depending on your operating system.

See [technical explanations](technical_explanations.md) for how this works.

**Run the project** :rocket:

1. `npm install` in project root to install the eslint & prettier packages
2. `npm run dev` to run it - requires docker compose installed.
3. Check if it worked: The docker logs should have a line saying database connection works. Open `localhost:5173` in browser to check if frontend works and shows data.
