### Setting up a new table view

Following things are needed to create a new page with a table (examples are all from Cross-Search):

- Backend:

  - The [App](../../backend/src/app.ts) should use the route.
  - A [route](../../backend/src/routes/crossSearch.ts) function calling the service.
  - A [service](../../backend/src/services/crossSearch.ts) to get the data from the database. There might be a necessities to clean the result, filter the result by project ids (pid) and user's permissions, and create a temp type for typescript.
  - Earlier we used prisma.findMany-function to fetch the data, but with cross search's 90k rows, the GET-call took approx 40s in staging environment. We found out that prisma.rawSQL with LEFT JOIN would reduce time of the call from 10s to 3s in dev environment. This reduced the call time for staging to approx 10s. Could possible be implemented for other tables also for better performance.

- Frontend:
  - Create necessary types in [backendtypes](../../frontend/src/backendTypes.d.ts)
  - Create a button for the component in [navigation bar](../../frontend/src/components/NavBar.tsx)
  - Create a relevant page-object for [Pages](../../frontend/src/components/pages.tsx)
  - Add a route for the component to [App](../../frontend/src/App.tsx)
  - Create a [component](../../frontend/src/components/CrossSearch/CrossSearchTable.tsx) (note that cross search borrows the detail parts from localities). 
- Table view:
The tableview is defined via variables columns and visibleColumns. Columns in the most simple form only require an accesrKey and a header. If an accessorFn is used, a separate id is required as well. The accessorkey functions as a key to fetch data as well as an id to reference the column as well. The variable visibleColumns takes in accessorKeys or ids for columns, set to false, to be hidden by default.
  - non-default filtering (eg filterVariant 'range' for numbers or filterFn 'contains' for text substrings) require no null values in the data for given column. It is needed to use accessorFn to map nulls to 'N/A' for example. ('N/A' works for numbers and text.)
 - non-hideable columns can be set by setting parameter `enableHiding: false`

More info can be found from official [MRT docs](https://www.material-react-table.com/)