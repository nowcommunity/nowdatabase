import express from 'express'
import cors from 'cors'
import logger from './utils/logger'
import sequelize from './utils/db'

const app = express()

app.use(express.json())
app.use(cors())

const PORT = 4000

app.get('/ping', (_req, res) => {
  logger.info('someone pinged')
  res.send({ message: 'pong' })
})

const testDbConnection = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Connected to database')
  } catch (error) {
    logger.error(`Database connection error: ${error}`)
  }
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  testDbConnection()
})
