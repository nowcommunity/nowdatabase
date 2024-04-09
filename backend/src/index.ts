import express from 'express'
import cors from 'cors'
import logger from './utils/logger'
import 'express-async-errors'
import { testDb } from './services/loc_name'
import { sequelize } from './utils/db'
import userRouter from './routes/user'
import { requestLogger } from './utils/requestLogger'

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
  await sequelize.authenticate()
  await testDb()
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  void testDbConnection()
})
