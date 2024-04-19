import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { testDbConnection } from './utils/db'
import userRouter from './routes/user'
import localityRouter from './routes/locality'
import { requestLogger, responseLogger } from './utils/requestLogger'
import compression from 'compression'
import { logger } from './utils/logger'
import { PORT } from './utils/config'

const app = express()

app.use(express.json())
app.use(cors())
app.use(compression())
app.use(requestLogger)
app.use(responseLogger)
app.use('/user', userRouter)
app.use('/locality', localityRouter)

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  void testDbConnection()
})
