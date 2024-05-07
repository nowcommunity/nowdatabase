### Typing the API

Here are tips on how to type a route from database to frontend. Types are imported in `frontend/src/backendTypes.d.ts` and then exported for the use of frontend. Don't import from normal backend files; import either from Prisma-namespace or write the types yourself.

### Generating types

If a route returns a type that is **directly from a database table**, you can bring the type to `backendTypes.d.ts` directly from Prisma namespace. For example, the table `now_loc` can be exported to frontend like this:

`const type LocalityDetails = Prisma.now_loc`

Notice the **naming convention**: `LocalityDetails` for the types that are used in detail-views, e.g. they include all columns from a table, and possibly join tables too. For the type used in TableView (only selected fields) let's use `Locality`.

To describe a type that does not correspond directly to a database table, for example `Reference`, where we want to include other tables in the fields, and pick only certain columns as fields. You can either write this type by hand (simpy hovering on the result-variable should show the type), or use tsc to generate the types. This works because Prisma can deduce the types from the query we write. The type, however, is implicit. To turn it explicit, we can use Typescript compiler. Let's run `npx tsc src/services/reference.ts --declaration --emitDeclarationOnly`. This creates a file `reference.d.ts` which will have the outputs of the functions in the service file. Copy only the relevant object shape, not the "Promise" and other things. Then make it an exported type in `frontend/src/backendTypes.d.ts`:

```
export type Reference = {
  ref_authors: {
      au_num: number;
      author_surname: string;
      author_initials: string;
  }[];
  ref_journal: {
      journal_title: string;
  };
  ref_ref_type: {
      ref_type: string;
  };
  rid: number;
  title_primary: string;
  date_primary: number;
  title_secondary: string;
}
```

After that, delete `reference.d.ts` and the other .d.ts files created by the compiler (it will also emit the types for the files that `reference.ts` imports).

### Typing the queries in frontend

RTK Query takes in generic type parameters for the querys. The first type is the result type, e.g. the data that backend sends as a successful response. The second is the parameter. Leave it as `void` if there are no parameters, if there are multiple, make it an object and type the fields.

```
// referenceReducer.ts

const referencesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllReferences: builder.query<Reference[], void>({
      query: () => ({
        url: `/reference/all`,
      }),
    }),
    getReferenceDetails: builder.query<ReferenceDetails, number>({
      query: id => ({
        url: `/reference/${id}`,
      }),
    }),
  }),
})

```

Notice:
+ Since the getAll-route returns an array, we have `Reference[]` as the result type.
+ On the line `query: id => ({` the id does not need to be typed as it is inferred from the parameter type `number` given on the line before.
