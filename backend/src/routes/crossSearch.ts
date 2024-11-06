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
  const sorting = req.query.sorting as Sorting[] | []
  const page = req.query.pagination as unknown as string
  if (!page) return res.status(200).send([])  // there is no pagination in the request when navigating to the page at first
  const pageObject = JSON.parse(page as string) as Page
  const data = await getFilteredCrossSearch(columnfilter, sorting, pageObject, req.user)
  return res.status(200).send(fixBigInt(data))
});

export default router
