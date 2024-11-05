import { Page } from '../../../frontend/src/backendTypes'

export const paginateList = (data: any[], page: Page) => {
  if (page) {
    const start = page.pageIndex * page.pageSize
    const end = start + page.pageSize
    return data.slice(start, end)
  }
  return data
}