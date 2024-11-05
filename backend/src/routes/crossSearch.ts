import { Router } from 'express'
import { getAllCrossSearch } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all/*', async (req, res) => {
  console.log('getting all cross search')
  const crossSearch = await getAllCrossSearch(req.user)
  return res.status(200).send(fixBigInt(crossSearch))
})

router.get(`/`, async (req, res) => {
  const columnfilter = req.query.columnfilters;
  const sorting = req.query.sorting;
  const page = req.query.pagination;
  return res.status(200).send([]);
});

export default router
