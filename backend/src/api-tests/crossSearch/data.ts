import type { ColumnFilter, Sorting, Page } from '../../../../frontend/src/backendTypes'

export const columnFilter: ColumnFilter = {
  country: 'S',
  genus_name: 'Pe',
}
export const sorting: Sorting = {
  id: 'country',
  desc: true,
}
export const page: Page = {
  pageIndex: 0,
  pageSize: 15,
}

export default {
  columnFilter,
  sorting,
  page,
}
