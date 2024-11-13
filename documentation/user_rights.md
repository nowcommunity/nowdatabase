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

Creating or updating a locality requires the **Admin** or **EditUnrestricted** roles.

Deleting a locality requires the **Admin** or **EditUnrestricted** roles.

NOTE: Users with the **EditRestricted** role should only be able to create or update localities which are in the same project with the user. Otherwise they have reading rights only.

Current behaviour:

- Users with the **EditRestricted** role can access the edit view in **their own** localities, but sending the PUT request to the backend fails because the role doesn't have permissions.

## Species

Any user can get a list of species.

Any user can view the details of a species.

Creating or updating a species requires the **Admin** or **EditUnrestricted** roles.

Deleting a species requires the **Admin** or **EditUnrestricted** roles.

NOTE: Users with the **EditRestricted** role should be able to create and update species. This is currently not possible.

Current behaviour:

- Users with the **EditRestricted** role can access the editing/creating new species view from the frontend, but sending the PUT request to the backend fails because the role doesn't have permissions.

## References

Any user can get a list of references.

Any user can get a list of reference types.

Any user can view the details of a reference.

Creating or updating a reference requires the **Admin** or **EditUnrestricted** roles.

Deleting a reference requires the **Admin** role.

NOTE: Users with the **EditRestricted** role should not be able to read references.

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

NOTE: Users with the **EditRestricted** role should be able to get a list of time bounds and view their details, currently they are not allowed to.

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
