import { Router } from 'express'
import { getAllCrossSearch, getFilteredCrossSearch } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'
import { ColumnFilter, Sorting, Page } from '../../../frontend/src/backendTypes'
import { paginateList } from '../utils/pagination'

const router = Router()

router.get('/all/*', async (req, res) => {
  console.log('getting all cross search')
  const crossSearch = await getAllCrossSearch(req.user)
  return res.status(200).send(fixBigInt(crossSearch))
})

router.get(`/`, async (req, res) => {
  const columnfilter = req.query.columnfilters as ColumnFilter[] | []
  console.log('columnfilter', columnfilter)
  const sorting = req.query.sorting as Sorting[] | []
  console.log('sorting', sorting)
  const data = await getFilteredCrossSearch(columnfilter, sorting, req.user)
  console.log('data', data)
  const page = req.query.pagination as unknown as Page
  if (!page) return res.status(200).send([])  // there is no pagination in the request when navigating to the page at first
  console.log('getting filtered cross search')
  const paginatedData = paginateList(data, page)
  return res.status(200).send(paginatedData)
});

export default router
