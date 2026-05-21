# Entity Documentation

This folder documents the main domain entities used by NOW Database. The goal is to keep a short, practical map of how each user-facing concept relates to Prisma models, API routes, and common frontend usage.

## Primary entities

- [Localities](locality.md): locality records, dating methods, age fields, coordinates, and locality tabs.
- [Species](species.md): taxonomy records, required taxonomy fields, and species synonyms.
- [Occurrences](occurrence.md): locality-species relationships and occurrence-specific editable fields.
- [References](reference.md): reference records, reference types, authors, journals, and entity-reference links.
- [Time Units](time_unit.md): named geologic time units and sequence/rank data.
- [Time Bounds](time_bound.md): lower and upper bounds used by time units and locality dating.

## Supporting entities

- [Museums](museum.md): museum lookup records and locality-museum links.
- [People](people.md): person records, optional user accounts, roles, and coordinator/contact links.
- [Projects](project.md): projects, project contacts, project people, and locality/project links.
- [Regions](region.md): named regions, countries, and coordinators.
- [Reference Types](reference_types.md): available reference type definitions.

## Coverage notes

The Prisma schema also contains lower-level join, update-log, synonym, and lookup tables. Those should usually be documented inside the closest user-facing entity page unless they become independently editable in the UI.

When adding an entity page, include:

- the main Prisma model/table name
- important relation tables
- the routes used by the UI
- the permission model, if it differs from the default authenticated read/edit flow
- any known implementation caveats that would help the next change
