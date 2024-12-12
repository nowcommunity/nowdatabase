# TableView

[TableView](../../../frontend/src/components/TableView/TableView.tsx) is a generic component that takes in column definitions, data, and renders a [material-react-table (click for docs)](https://www.material-react-table.com/). It also handles the tables state management: for example saving column filters into url, and restoring them on first render.

The table itself is constructed with the useMaterialReactTable-hook. The toolbar at the top is defined in the [helpers](../../../frontend/src/components/TableView/helpers.tsx) file and rendered using the `renderToolbarInternalActions` option, and it contains buttons for showing/hiding columns and showing the table in fullscreen mode, as well as exporting the content of the table. If the toolbar needs to be changed in the future (e.g. adding more rows to it) checkout the documentation for rendering a custom toolbar [here](https://www.material-react-table.com/docs/guides/toolbar-customization#override-with-custom-toolbar-components) since the current method doesn't really allow any major changes to its layout.

### Setting up a new table view

Following things are needed to create a new page with a table (examples are all from Cross-Search):

- Backend:

  - The [App](../../../backend/src/app.ts) should use the route.
  - A [route](../../../backend/src/routes/crossSearch.ts) function calling the service.
  - A [service](../../../backend/src/services/crossSearch.ts) to get the data from the database. There might be a necessities to clean the result, filter the result by project ids (pid) and user's permissions, and create a temp type for typescript.
  - Earlier we used prisma.findMany-function to fetch the data, but with cross search's 90k rows, the GET-call took approx 40s in staging environment. We found out that prisma.rawSQL with LEFT JOIN would reduce time of the call from 10s to 3s in dev environment. This reduced the call time for staging to approx 10s. Could possible be implemented for other tables also for better performance.

- Frontend:
  - Create necessary types in [shared types](../../../frontend/src/shared/types)
  - Create a button for the component in [navigation bar](../../../frontend/src/components/NavBar.tsx)
  - Create a relevant page-object for [Pages](../../../frontend/src/components/pages.tsx)
  - Add a route for the component to [App](../../../frontend/src/App.tsx)
  - Create a [component](../../../frontend/src/components/CrossSearch/CrossSearchTable.tsx) (note that cross search borrows the detail parts from localities).
- Table view:
  The [TableView](../../../frontend/src/components/TableView/TableView.tsx) is defined via variables columns and visibleColumns. Columns in the most simple form only require an accessorKey and a header. If an accessorFn is used, a separate id is required as well. The accessorkey functions as a key to fetch data as well as an id to reference the column as well. The variable visibleColumns takes in accessorKeys or ids for columns, set to false, to be hidden by default.
  - Non-default filtering (eg filterVariant 'range' for numbers or filterFn 'contains' for text substrings) require no null values in the data for given column. It is needed to use accessorFn to map nulls to an empty string for example.
- non-hideable columns can be set by setting parameter `enableHiding: false`.
- to enable a filter mode selection menu for the columns of the table, set paramater `enableColumnFilterModes` to `true`
- you can pass an array of filter functions to be shown in the menu to the parameter `columnFilterModeOptions`
- it's a good idea to disable the filter mode menu for columns for which it doesn't make sense by setting the parameter `enableColumnFilterModes` to `false` for that column. See [LocalityTable](../../../frontend/src/components/Locality/LocalityTable.tsx) for an example
- for more information, see [MRT docs filter mode section](https://www.material-react-table.com/docs/guides/column-filtering#filter-modes)

More info can be found from official [MRT docs](https://www.material-react-table.com/)
