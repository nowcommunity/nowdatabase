import express from 'express'
import cors from 'cors'
import logger from './utils/logger'
import 'express-async-errors'
import { testDb } from './services/now_loc'
import { sequelize } from './utils/db'
import userRouter from './routes/user'
import { requestLogger } from './utils/requestLogger'
import { sleep } from './utils/common'

const app = express()

app.use(express.json())
app.use(cors())
app.use(requestLogger)
app.use('/user', userRouter)

const PORT = 4000

app.get('/ping', (_req, res) => {
  logger.info('someone pinged')
  res.send({ message: 'pong' })
})

const testDbConnection = async () => {
  const tryDbConnection = async () => {
    try {
      await sequelize.authenticate()
      await testDb()
      return true
    } catch (e) {
      if (e instanceof Error) logger.error(e.toString())
      else logger.error('DB connection failed with unknown error type')
      return false
    }
  }
  const maxAttempts = 20
  let attempts = 0
  while (attempts < maxAttempts) {
    const success = await tryDbConnection()
    if (success) {
      return
    }
    logger.info(`Trying again in 6 seconds, attempt ${attempts} / ${maxAttempts}`)
    attempts++
    await sleep(6000)
  }
  logger.error(`Attempted ${maxAttempts} times, but database connection could not be established`)
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  void testDbConnection()
})
