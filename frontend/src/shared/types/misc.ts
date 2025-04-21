/* Misc types that are more miscellaneous or general than data-folder */

export enum Role {
  Admin = 1,
  EditUnrestricted = 2,
  EditRestricted = 3,
  NowOffice = 4,
  Project = 5,
  ProjectPrivate = 6,
  ReadOnly = 7,
}

export type User = {
  username: string
  role: Role
  userId: number
  initials: string
}

export type ValidationErrors = {
  status: string
  data: ValidationErrorItem[]
}

type ValidationErrorItem = {
  name: string
  error: string
}

export type ColumnFilter = { id: string; value: string }
export type SortingState = { desc: boolean; id: string }

export type CrossSearchRouteParameters = {
  limit?: string
  offset?: string
  columnFilters: string
  sorting: string
}

export type ParsedCrossSearchRouteParameters = {
  limit?: number
  offset?: number
  columnFilters: unknown[]
  sorting: unknown[]
}

export type ValidatedCrossSearchRouteParameters = {
  limit?: number
  offset?: number
  columnFilters: ColumnFilter[]
  sorting: SortingState[]
}
