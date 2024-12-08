export type RowState = 'new' | 'removed' | 'cancelled' | 'clean'

// Use this for fields that include array that has to be edited by EditableTable.
// For example see LocalityDetails: museums field
export type Editable<T> = T & { rowState?: RowState }

/* This makes all fields optional, except for array-type fields.
  Also wraps the objects inside arrays as Editable, adding rowState-field in them.
  Applies itself recursively to all nested objects even inside arrays. */
export type EditDataType<T> = T extends object
  ? T extends readonly unknown[]
    ? { [I in keyof T]: Editable<EditDataType<T[I]>> }
    : { [K in keyof T as T[K] extends readonly unknown[] ? K : never]: EditDataType<T[K]> } & {
          [K in keyof T as T[K] extends readonly unknown[] ? never : K]?: EditDataType<T[K]>
        } extends infer U
      ? { [K in keyof U]: U[K] }
      : never
  : T

// Changes all bigints to number type including in nested objects
export type FixBigInt<T> = {
  [K in keyof T]: T[K] extends bigint | null
    ? number | null
    : T[K] extends (infer U)[]
      ? FixBigInt<U>[]
      : T[K] extends object
        ? FixBigInt<T[K]>
        : T[K]
}
