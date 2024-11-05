import { Router } from 'express'
import { getAllCrossSearch } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all/*', async (req, res) => {
  console.log('getting all cross search')
  const crossSearch = await getAllCrossSearch(req.user)
  return res.status(200).send(fixBigInt(crossSearch))
})

router.get(`/test`, async (req, res) => {
  console.log('filtering cross search');
  return res.status(200).send([]);
});

export default router
