### Server Side Pagination

The cross search table uses server side pagination to avoid loading tens of thousands of rows at once. Currently this is not needed for the other tables, but if this changes you can use the information on this page as a rough guide and to avoid some of the issues that might appear. 

The server side pagination for cross search is implemented in the following way: 

1. The backend route is given values for limit, offset, column filters, and sorting.
   - `limit` and `offset` should be numbers, and both `columnFilters` and `sorting` should be an array of objects containing the keys `id` and `value`. `sorting` is currently an array because Material React Table supports multiple sorting values. The backend only uses the first value in the array for the SQL query.
2. The values are validated. This is done in two places: the [validation file](../../frontend/src/shared/validators/crossSearch.ts) and the [getCrossSearchRawSql function](../../backend/src/services/crossSearch.ts).
   - The checks inside getCrossSearchRawSql are very important since they check if the values given to the `WHERE` and `ORDER BY` clauses are valid column ID's. Without these the query is vulnerable to SQL injection (see below)
3. Since the SQL query uses aliases, some values used in the query need to be converted first. This is done with the [convertIdToFieldName function](../../backend/src/services/crossSearch.ts).
4. The values are given to [generateCrossSearchSql function](backend/src/services/queries/crossSearchQuery.ts), which generates the SQL query. The values are used in the `LIMIT`, `OFFSET`, `WHERE` and `ORDER BY` clauses, respectively. To allow TableView to show and change pages correctly, we also add a `full_count` column to every row which contains the amount of rows in the entire cross-search table.
5. The `getCrossSearchRawSql` function executes the query and returns the result.

[TableView](../../frontend/src/components/TableView/TableView.tsx) has a `serverSidePagination` boolean prop that should be set to True when the table in question is using server side pagination. Remember to check out the [documentation for TableView](../frontend/components/TableView.md) too!

IMPORTANT! The `WHERE` and `ORDER BY` clauses use dynamic column names to make changing column filtering and sorting possible. This opens up a vulnerability for SQL injection, because this part of the query has to be built using the `Prisma.raw` function. It's essential to check that the values given by the user are proper column id's before using them in the query. Other dynamic values use the `Prisma.sql` function, which is safe from SQL injection.


More information about making raw queries and avoiding SQL injections here: https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries
