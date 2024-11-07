import { Router } from 'express'
import { getAllCrossSearch, getFilteredCrossSearch, getFilteredCrossSearchLength, getTestQuery } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { ColumnFilter, Sorting, Page } from '../../../frontend/src/backendTypes'

const router = Router()

router.get('/all/*', async (req, res) => {
  console.log('getting all cross search')
  const crossSearch = await getAllCrossSearch(req.user)
  return res.status(200).send(fixBigInt(crossSearch))
})

router.get('/testing', async (req, res) => {
  console.log('getting all cross search')
  await getTestQuery()
  return res.status(200).send()
})

router.get(`/`, async (req, res) => {
  const columnfilter = req.query.columnfilters as unknown as string
  const sorting = req.query.sorting as unknown as string
  const page = req.query.pagination as unknown as string
  if (!page) return res.status(200).send([])  // there is no pagination in the request when navigating to the page at first
  const columnfilterObject = JSON.parse(columnfilter as string) as ColumnFilter[]
  const sortingObject = JSON.parse(sorting as string) as Sorting[]
  console.log('sortingObject',sortingObject)
  const pageObject = JSON.parse(page as string) as Page
  const data = await getFilteredCrossSearch(columnfilterObject, sortingObject, pageObject, req.user) as any
  const rowCount = await getFilteredCrossSearchLength(columnfilterObject, req.user)
  const result = {
    data: fixBigInt(data),
    rowCount,
  }
  return res.status(200).send(result)
});

export default router
