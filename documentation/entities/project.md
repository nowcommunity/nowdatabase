# Projects

Projects are used to group data entries under a shared “project” (for example, a locality can be linked to one or more projects).

## Database model

The main project record is `now_proj`:

- `pid` (primary key)
- `proj_code` (short code)
- `proj_name` (display name)
- `proj_status`
- `contact` (links to a person by `com_people.initials`)

Relations that are commonly included in detail payloads:

- `now_proj_people`: coordinators / people attached to the project (`now_proj_people.initials` → `com_people.initials`)

Localities are linked to projects via `now_plr` (composite key: `lid` + `pid`).

## API endpoints

- `GET /project/all` (authenticated): list projects visible to the current user
- `GET /project/:id` (admin): project details
- `POST /projects` (admin): create a project
- `PUT /projects/:id` (admin): update a project
- `DELETE /project/:id` (admin): delete a project

