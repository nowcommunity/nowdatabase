/* Util-types - generics or otherwise used for type-technical things */

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

export type RowState = 'new' | 'removed' | 'cancelled' | 'clean'

// Use this for fields that include array that has to be edited by EditableTable.
// For example see LocalityDetails: museums field
export type Editable<T> = T & { rowState?: RowState }

type CrownSegment = string | number | null | undefined

const mapCrownSegment = (segment: CrownSegment): string => {
  if (segment === null || segment === undefined || segment === '') {
    return '-'
  }

  return String(segment)
}

type DevelopmentalCrownTypeSource = {
  cusp_shape?: CrownSegment
  cusp_count_buccal?: CrownSegment
  cusp_count_lingual?: CrownSegment
  loph_count_lon?: CrownSegment
  loph_count_trs?: CrownSegment
}

export const formatDevelopmentalCrownType = <T extends DevelopmentalCrownTypeSource>(source: T): string => {
  return [
    source.cusp_shape,
    source.cusp_count_buccal,
    source.cusp_count_lingual,
    source.loph_count_lon,
    source.loph_count_trs,
  ]
    .map(mapCrownSegment)
    .join('')
}

type FunctionalCrownTypeSource = {
  fct_al?: CrownSegment
  fct_ol?: CrownSegment
  fct_sf?: CrownSegment
  fct_ot?: CrownSegment
  fct_cm?: CrownSegment
}

export const formatFunctionalCrownType = <T extends FunctionalCrownTypeSource>(source: T): string => {
  return [source.fct_al, source.fct_ol, source.fct_sf, source.fct_ot, source.fct_cm].map(mapCrownSegment).join('')
}
