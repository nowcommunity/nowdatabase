### Setting up a new table view

Following things are needed to create a new page with a table (examples are all from Cross-Search):

 - Backend:
   - A [service](../backend/src/services/crossSearch.ts) to get the data from the database. There might be a necessities to clean the result, filter the result by project ids (pid) and user's permissions, and create a temp type for typescript.
   - A [route](../backend/src/routes/crossSearch.ts) function calling the service.
   - The [App](../backend/src/app.ts) should use the route.

- Frontend:
  - Create necessary types in [backendtypes](../frontend/src/backendTypes.d.ts)
  - Create a [component](../frontend/src/components/CrossSearch/CrossSearchTable.tsx) (note that cross search borrows the detail parts from localities). The tableview is defined via variables columns and visibleColumns. Columns in the most simple form only require an accesrKey and a header. If an accessorFn is used, a separate id is required as well. The accessorkey functions as a key to fetch data as well as an id to reference the column as well. The variable visibleColumns takes in accessorKeys or ids for columns, set to false, to be hidden by default.
  - Create a button for the component in [navigation bar](../frontend/src/components/NavBar.tsx)
  - Create a relevant page-object for [Pages](../frontend/src/components/pages.tsx)
  - Add a route for the component to [App](../frontend/src/App.tsx)
