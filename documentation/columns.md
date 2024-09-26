### Columns customization

Each table have their columns defined in the components own table-file. For example the columns of Cross-search table are defined in frontend/src/components/CrossSearch/CrossSearchTable.tsx in the variable columns. When defining column without an accessorFn, only accessorKey and a header are required. AccessorKey functions as an id and an accessorKey to get the correct data. With an accessorFn an explicit id needs to be defined as well. Hidden by default columns are set in the variable 'visibleColumns' in the same file. If an column (referenced by accesorKey or id) is set to false, they are hidden by default.

![image](https://github.com/user-attachments/assets/91b53d83-a798-4b1b-b3a3-fcbdcb54bbd5)
![image](https://github.com/user-attachments/assets/323bc4fd-1860-4188-bc2d-3f4bb4abbe93)

