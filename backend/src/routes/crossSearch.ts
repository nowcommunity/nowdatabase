import { Router } from 'express'
import {
  getAllCrossSearch,
  getFilteredCrossSearchLength,
  getFilteredCrossSearchRawSql,
} from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { isPage } from '../utils/url'
import { ColumnFilter, Sorting, Page } from '../../../frontend/src/backendTypes'

const router = Router()

router.get('/all', async (req, res) => {
  console.log('getting all cross search')
  console.time('Cross search all')
  const crossSearch = await getAllCrossSearch(req.user)
  console.timeEnd('Cross search all')
  return res.status(200).send(fixBigInt(crossSearch))
})


router.get('/testing/all', async (req, res) => {
  const columnfilter = req.query.columnfilters
  const sorting = req.query.sorting
  const page = req.query.pagination

  if (!isPage(page)) return res.status(200).send([]) // there is no pagination in the request when navigating to the page at first

  // TODO remove "as string"
  const columnfilterObject = JSON.parse(columnfilter as string) as ColumnFilter[]
  const sortingObject = JSON.parse(sorting as string) as Sorting[]
  const pageObject = JSON.parse(page as string) as Page

  const result = (await getFilteredCrossSearchRawSql(columnfilterObject, sortingObject, pageObject, req.user)) as any

  return res.status(200).send(result)
})

router.get(`/`, async (req, res) => {
  const columnfilter = req.query.columnfilters as unknown as string
  const sorting = req.query.sorting as unknown as string
  const page = req.query.pagination as unknown as string

  if (!page) return res.status(200).send([]) // there is no pagination in the request when navigating to the page at first

  const columnfilterObject = JSON.parse(columnfilter as string) as ColumnFilter[]
  const sortingObject = JSON.parse(sorting as string) as Sorting[]
  console.log('sortingObject', sortingObject)
  const pageObject = JSON.parse(page as string) as Page

  const data = (await getFilteredCrossSearchRawSql(columnfilterObject, sortingObject, pageObject, req.user)) as any
  const rowCount = await getFilteredCrossSearchLength(columnfilterObject, req.user)

  const result = {
    data: fixBigInt(data),
    rowCount,
  }
  return res.status(200).send(result)
})

export default router
