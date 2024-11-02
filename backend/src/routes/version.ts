import { Router } from 'express'
import { dateWhenStarted } from '../app'

const router = Router()

router.get('/', (_req, res) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }
  res.status(200).send({ date: dateWhenStarted.toLocaleDateString('fi-FI', options) })
})

export default router
