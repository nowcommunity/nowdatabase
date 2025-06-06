# EditableTable

[EditableTable](../../../frontend/src/components/DetailView/common/EditableTable.tsx) is a table component that allows the user to add and remove rows during editing. Some EditableTables might be tables of other entities, like the Species-table in the Species-tab of a Locality. In these cases, there is a link to the detail view of those entities on every row. To add links to an EditableTable, give it the `idFieldName` and `url` parameters.
