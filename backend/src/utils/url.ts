import type {
  ColumnFilter,
  ColumnFilterUrl,
  Sorting,
  SortingUrl,
  Page,
  PageUrl,
} from '../../../frontend/src/backendTypes'

const MAX_PAGE_SIZE = 200

// /crosssearch/?&columnfilters=[]&sorting=[]&pagination={%22pageIndex%22:0,%22pageSize%22:15}
export const constructFilterSortPageUrl = (
  filters: ColumnFilter | [] = [],
  sorting: Sorting | [] = [],
  page: Page | {} = {}
) => {
  // (sorting as any)["desc"] = `"${(sorting as any)["desc"]}"`
  const filterObj = Object.keys(filters).map(filter => {
    return { id: filter, value: (filters as any)[filter] }
  }) as ColumnFilterUrl[]
  const sortingObj = sorting as SortingUrl
  const pageObj = page as Page

  const filterString: string = JSON.stringify(filterObj) ?? ''
  const sortingString: string = Object.keys(sortingObj).length !== 0 ? JSON.stringify(sortingObj) : ''
  const pageString: string = JSON.stringify(pageObj) ?? ''

  const urlString = `&columnfilters=${filterString}&sorting=[${sortingString}]&pagination=${pageString}`
  return urlString
}

export const parseFilterSortPageUrl = (filterUrl: ColumnFilterUrl, sortingUrl: SortingUrl, pageUrl: PageUrl) => {
  const filterObj: ColumnFilter = {
    [filterUrl.id]: filterUrl.value,
  }
  const sortingObj = sortingUrl as Sorting
  const pageObj = pageUrl as Page

  return { filterObj, sortingObj, pageObj }
}

export const isPage = (page: any): page is Page => {
  if (typeof page !== 'object' && typeof page !== 'string') return false

  if (typeof page === 'string') {
    page = JSON.parse(page)
  }

  if (!Object.keys(page).includes('pageIndex') || !Object.keys(page).includes('pageSize')) {
    return false
  }

  if (typeof page.pageIndex !== 'number' || typeof page.pageSize !== 'number') return false

  if (page.pageIndex < 0) return false
  if (page.pageSize > MAX_PAGE_SIZE || page.pageSize < 0) return false

  return true
}

type FilterMethod = 'beginsWith' | 'fuzzy' | 'exact'

export const constructFilterSql = (filters: ColumnFilterUrl[], filterMethod: FilterMethod = 'beginsWith') => {
  if (filterMethod !== 'beginsWith') throw Error(`Method ${filterMethod} not yet implemented`)
  if (filters.length === 0) return { sqlFilterStringList: [], sqlFilterParameterList: ['TRUE'] }

  const sqlFilterParameterList: string[] = []
  //const sqlFilterStringList: string[] = Array(filters.length - 1).fill(' AND ')
  const sqlFilterStringList: string[] = []

  // This is not currently used but is kept for "just in case"
  filters.map(filter => {
    if (sqlFilterStringList.length !== 0) sqlFilterStringList.push(' AND ')
    sqlFilterParameterList.push(filter.id)
    sqlFilterStringList.push(' LIKE ')
    sqlFilterParameterList.push(`${filter.value + '%'}`)
  })

  console.log(sqlFilterStringList, ...sqlFilterParameterList)

  return { sqlFilterStringList, sqlFilterParameterList }
}