### Entries to database

Both editing and creating new entries go via same route in the app. Following things are needed for an entry (examples are from species) to work:

- Backend:

  - A `put`-route in corresponding [routes file](../../backend/src/routes/species.ts) that calls requireOneOf to check user rights, a validation function to check the data and the writer function to insert the data to the database and return the id of the entry if all checks pass.
  - A validator and a write functions in [services](../../backend/src/services/species.ts) for the route to call.

- Frontend:
  - [Spesific validators](../../frontend/src/shared/validators/species.ts) are defined here.
  - An api-endpoint for edit needs to be defined in [reducers](../../frontend/src/redux/speciesReducer.ts) (this serves for creating a new entry as well)
  - An onWrite-function needs to be defined with the help of the api-endpoint and call navigate-function to end up in the [details-view](../../frontend/src/components/Species/SpeciesDetails.tsx) of the edited/created entry. (At the moment there's a 15ms time-out before the navigation for species as sometimes it tried to navigate before knowing where to (no id yet). This could be investigated if this is a more general bug or something weird happening only in species)
