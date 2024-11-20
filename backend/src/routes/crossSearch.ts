import { Router } from 'express'
import { getAllCrossSearch, getCrossSearchRawSql } from '../services/crossSearch'
import { fixBigInt } from '../utils/common'

const router = Router()

router.get('/all', async (req, res) => {
  console.log('getting old cross search')
  console.time('Cross search old')
  const crossSearch = await getAllCrossSearch(req.user)
  console.timeEnd('Cross search old')
  console.log('length: ', crossSearch.length)
  return res.status(200).send(fixBigInt(crossSearch))
})

router.get('/testing/all', async (req, res) => {

  // TODO remove "as string"

  const result = await getCrossSearchRawSql(req.user)

  return res.status(200).send(result)
})

router.get(`/`, async (req, res) => {
  console.log('getting new cross search')
  console.time('Cross search new')
  const result = await getCrossSearchRawSql(req.user)
  console.timeEnd('Cross search new')
  console.log('length: ', result.length)
  return res.status(200).send(fixBigInt(result))
})

export default router
