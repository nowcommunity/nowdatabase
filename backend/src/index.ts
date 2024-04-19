import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { testDbConnection } from './utils/db'
import userRouter from './routes/user'
import localityRouter from './routes/locality'
import { requestLogger, responseLogger } from './middlewares/requestLogger'
import compression from 'compression'
import { logger } from './utils/logger'
import { PORT } from './utils/config'
import { tokenExtractor } from './middlewares/authenticator'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(express.json())
app.use(cors())
app.use(compression())
app.use(tokenExtractor)
app.use(requestLogger)
app.use(responseLogger)
app.use('/user', userRouter)
app.use('/locality', localityRouter)
app.use(errorHandler)
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  void testDbConnection()
})
