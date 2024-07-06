### Explanation of user rights of each route

### Localities
+ `GET` routes (`/all` or `/:id`)
  + Anyone, except
    + Only localities with public status are returned, unless the user role is Admin or EditUnrestricted, or user is a member of a project that is included in the draft locality's project

+ `POST / PUT`
  + Available to Admin, EditUnrestricted, ...

+ `DELETE`
  + Admin
  + EditUnrestricted

### Species

+ `GET` routes (`/all` or `/:id`)
  + ?
