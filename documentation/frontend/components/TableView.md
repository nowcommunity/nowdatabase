# TableView

[TableView](../../../frontend/src/components/TableView/TableView.tsx) is a generic component that takes in column definitions, data, and renders a [material-react-table (click for docs)](https://www.material-react-table.com/). It also handles the tables state management: for example saving column filters into url, and restoring them on first render.

TableView has the following required props:

- `data`: The array of data that is shown
- `columns`: Array of columns. Columns are objects that in their simplest form only require an accessorKey and a header. The accessorKey functions as a key to fetch data as well as an id to reference the column, and the header is the display name of the column. If an accessorFn is used, a separate id is required as well. See [SpeciesTable](../../../frontend/src/components/Species/SpeciesTable.tsx) for example.
- `visibleColumns`: An object containing accessorKeys or ids for columns to be hidden by default. See [SpeciesTable](../../../frontend/src/components/Species/SpeciesTable.tsx) for example.
- `idFieldName`: The id field for each row (for example "species_id" in SpeciesTable). This is used in the [DetailBrowser](../../../frontend/src/components/DetailView/DetailBrowser.tsx) to allow the user to navigate to the next or previous item inside a detail view.
- `isFetching`: a boolean that should be True whenever the table is fetching (every time a request is made to get data). This is used to show a nice loading visual over the table when it's waiting for more data to load. When using queries, the useQuery() functions return an `isFetching` value which should be used here, see [SpeciesTable](../../../frontend/src/components/Species/SpeciesTable.tsx) for example. Can also be simply set to False if needed.

The table will handle paging and sorting data automatically. If your backend query for the table is using [server side pagination](../../backend/server_side_pagination.md), remember to set the `serverSidePagination` prop to True. Check the Table View section in the guide below for more information about optional props.

The table itself is constructed with the useMaterialReactTable-hook. The toolbar at the top is defined in the [helpers](../../../frontend/src/components/TableView/helpers.tsx) file and rendered using the `renderToolbarInternalActions` option, and it contains buttons for showing/hiding columns and showing the table in fullscreen mode, as well as exporting the content of the table. If the toolbar needs to be changed in the future (e.g. adding more rows to it) checkout the documentation for rendering a custom toolbar [here](https://www.material-react-table.com/docs/guides/toolbar-customization#override-with-custom-toolbar-components) since the current method doesn't really allow any major changes to its layout.

### Setting up a new table view

Following things are needed to create a new page with a table (examples are all from Cross-Search):

- Backend:

  - The [App](../../../backend/src/app.ts) should use the route.
  - A [route](../../../backend/src/routes/crossSearch.ts) function calling the service.
  - A [service](../../../backend/src/services/crossSearch.ts) to get the data from the database. There might be a necessities to clean the result, filter the result by project ids (pid) and user's permissions, and create a temp type for typescript.
  - Earlier we used prisma.findMany-function to fetch the data, but with cross search's 90k rows, the GET-call took approx 40s in staging environment. We found out that prisma.rawSQL with LEFT JOIN would reduce time of the call from 10s to 3s in dev environment. This reduced the call time for staging to approx 10s. Could possible be implemented for other tables also for better performance.

- Frontend:
  - Create necessary types in [shared types](../../../frontend/src/shared/types).
  - Create a button for the component in [navigation bar](../../../frontend/src/components/NavBar.tsx).
  - Create a relevant page-object for [Pages](../../../frontend/src/components/pages.tsx).
  - Add a route for the component to [App](../../../frontend/src/App.tsx).
  - Create a [component](../../../frontend/src/components/CrossSearch/CrossSearchTable.tsx) (note that cross search borrows the detail parts from localities).
- Table view:
  - Set the required props as described above.
  - Non-default filtering (eg filterVariant 'range' for numbers or filterFn 'contains' for text substrings) require no null values in the data for given column. It is needed to use accessorFn to map nulls to an empty string for example.
  - non-hideable columns can be set by setting parameter `enableHiding: false`.
  - to enable a filter mode selection menu for the columns of the table, set parameter `enableColumnFilterModes` to `true`.
  - you can pass an array of filter functions to be shown in the menu to the parameter `columnFilterModeOptions`.
  - it's a good idea to disable the filter mode menu for columns for which it doesn't make sense by setting the parameter `enableColumnFilterModes` to `false` for that column. See [LocalityTable](../../../frontend/src/components/Locality/LocalityTable.tsx) for an example. For more information, see [MRT docs filter mode section](https://www.material-react-table.com/docs/guides/column-filtering#filter-modes).
  - If the table you're creating is using server side pagination, remember to set the `serverSidePagination` prop to True so the TableView will set its pagination/sorting modes correctly. Forgetting to do this might make the table load indefinitely or crash the app.
  - More info can be found from official [MRT docs](https://www.material-react-table.com/).
