# Nowdatabase

**NOW - New and Old Worlds - Database of fossil mammals**

Rebuild of a fossil database application, old version at https://nowdatabase.luomus.fi/ 

The new version is not deployed yet.

_____

### Developer documentation :page_with_curl:

**Basic commands**

+ `npm run dev` 
  + Uses `docker-compose.dev.yml`
  + Run in development mode: with hot reload
+ `npm start`
  + Uses `docker-compose.yml`
  + Code is compiled like in production, but using the same local test database as the above command. 

**Further documentation**

The :open_file_folder: [documentation](documentation)-directory has documentation for developers. Remember to update it if you modify something important like project architecture.

:rocket: [Initialize app & restore db](documentation/init.md) 
+ How to get the app up & running, and initialize database from sql-dumps

:wrench: [Technical explanations](documentation/technical_explanations.md) 
+ Explanations of how things work, and guides for some more rare tasks like generating sequelize models.

:memo: [Frontend](documentation/frontend.md) 
+ Explanation of the frontend logic and how to add views

:mag_right: [Class diagram](documentation/class_diagram.md) 
+ See the relations of relevant tables. Notice that it omits some unimportant tables and does not show most columns.
