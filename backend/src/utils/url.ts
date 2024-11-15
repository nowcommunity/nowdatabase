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
  console.log('pagetype (alussa)', typeof page, typeof page !== 'object' || typeof page !== 'string')
  if (typeof page !== 'object' && typeof page !== 'string') return false

  if (typeof page === 'string') {
    page = JSON.parse(page)
  }

  console.log('pagetype', typeof page)
  console.log('page keys', Object.keys(page))
  if (!Object.keys(page).includes('pageIndex') || !Object.keys(page).includes('pageSize')) {
    return false
  }

  console.log('page value types', typeof page.pageIndex, typeof page.pageSize)
  if (typeof page.pageIndex !== 'number' || typeof page.pageSize !== 'number') return false

  if (page.pageIndex < 0) return false
  if (page.pageSize > MAX_PAGE_SIZE || page.pageSize < 0) return false

  return true
}
