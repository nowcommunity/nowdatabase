# User Rights

This document shows what each user role can and cannot do.

There are 7 different user roles:

- Admin (su)
- EditUnrestricted (eu)
- EditRestricted (er)
- Project (pl)
- ProjectPrivate (plp)
- NowOffice (no)
- ReadOnly (ro)

Users that have not logged in have the **ReadOnly** role.

The Project, ProjectPrivate and NowOffice roles exist in the code but are currently not used. They don't exist at all in frontend, and in backend they are only used when assigning roles to test users. The **EditRestricted** role is also only used in the frontend to show/hide editing buttons, the backend does not use the role in any way.

## Locality

Any user can get a list of localities.

Any user can view the details of a locality.

FRONTEND ONLY: Users with the **EditRestricted** role can edit **their own** localities, but cannot create localities. This only means that the button to edit shows up in the frontend, the user cannot actually edit anything because the backend doesn't allow it.

Creating or updating a locality requires the **Admin** or **EditUnrestricted** roles.

Deleting a locality requires the **Admin** or **EditUnrestricted** roles.

## Species

Any user can get a list of species.

Any user can view the details of a species.

FRONTEND ONLY: Users with the **EditRestricted** role can create new species and edit **any** species. This only means that the buttons to edit/create show up in the frontend, the user cannot actually edit or create new data because the backend doesn't allow it.

Creating or updating a species requires the **Admin** or **EditUnrestricted** roles.

Deleting a species requires the **Admin** or **EditUnrestricted** roles.

## References

Any user can get a list of references.

Any user can get a list of reference types.

Any user can view the details of a reference.

Creating or updating a reference requires the **Admin** or **EditUnrestricted** roles.

Deleting a reference requires the **Admin** role.

## Time Unit

Any user can get a list of time units.

Any user can view the details of a time unit.

Any user can get a list of sequences.

Creating or updating a time unit requires the **Admin** or **EditUnrestricted** roles.

Deleting a time unit requires the **Admin** or **EditUnrestricted** roles.

## Time Bound

Getting a list of time bounds requires the **Admin** or **EditUnrestricted** roles.

Viewing the details of a time bound requires the **Admin** or **EditUnrestricted** roles.

Creating or updating a time bound requires the **Admin** or **EditUnrestricted** roles.

Deleting a time bound requires the **Admin** or **EditUnrestricted** roles.

## Region

Viewing a list of all regions requires the **Admin** role.

Getting a spesific region using an id requires the **Admin** role.

## Person

Getting a list of every person requires the **Admin** role.

Any user can get their own information using their id, but cannot view other people's information (unless they have the **Admin** role)

## Project

Any user can get a list of projects.

Viewing the details of a project requires the **Admin** role.

## Museum

Any user can get a list of museums.

## Sedimentary Structure

Any user can get a list of sedimentary structures.

## Email

Sending an email requires the **Admin** role.

## User Rights Table

| test             | Locality | Species | References | Time Units | Time Bounds | Regions | Persons | Projects | Museums | Sedimentary Structures | Sending Email |
| ---------------- | -------- | ------- | ---------- | ---------- | ----------- | ------- | ------- | -------- | ------- | ---------------------- | ------------- |
| Admin            | ALL      | ALL     | ALL        | ALL        | ALL         | ALL     | ALL     | ALL      | ALL     | ALL                    | ALL           |
| EditUnRestricted | ALL      | ALL     | ALL        | ALL        | ALL         | X       | X\*     | R\*\*    | ALL     | ALL                    | X             |
| EditRestricted   | R        | R       | R          | R          | X           | X       | X\*     | R\*\*    | R       | R                      | X             |
| ReadOnly         | R        | R       | R          | R          | X           | X       | X\*     | R\*\*    | R       | R                      | X             |

C = Create

R = Read

R = Update

R = Delete

X = No rights

ALL = All rights

\* = Users can only get their own information.

\*\* = Any user can view a list of projects, but viewing the details of a project requires the **Admin** role.

Here's a picture of the old documentation in case it is needed:

![image](./images/oikeudet.png)
