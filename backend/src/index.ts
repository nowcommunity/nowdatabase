import express from 'express'
import cors from 'cors'
import logger from './utils/logger'

const app = express()

app.use(express.json())
app.use(cors())

const PORT = 4000

app.get('/ping', (_req, res) => {
  logger.info('someone pinged')
  res.send({ message: 'pong' })
})

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
