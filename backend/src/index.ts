import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import userRouter from './routes/user'
import localityRouter from './routes/locality'
import referenceRouter from './routes/reference'
import speciesRouter from './routes/species'
import timeUnitRouter from './routes/timeUnit'
import museumRouter from './routes/museum'
import { requestLogger, responseLogger } from './middlewares/requestLogger'
import compression from 'compression'
import { logger } from './utils/logger'
import { PORT, BACKEND_MODE } from './utils/config'
import { tokenExtractor, userExtractor, requireLogin } from './middlewares/authenticator'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(cors())
app.use(compression())
app.use(requestLogger)
app.use(tokenExtractor)
app.use(userExtractor)
app.use(responseLogger)

app.use('/user', userRouter)
if (BACKEND_MODE !== 'dev') app.use(requireLogin)

app.use('/locality', localityRouter)
app.use('/reference', referenceRouter)
app.use('/species', speciesRouter)
app.use('/time-unit', timeUnitRouter)
app.use('/museum', museumRouter)
app.use(errorHandler)
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
