import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import localityRouter from './routes/locality'
import museumRouter from './routes/museum'
import referenceRouter from './routes/reference'
import sedimentaryStructureRouter from './routes/sedimentaryStructure'
import regionRouter from './routes/region'
import personRouter from './routes/person'
import projectRouter from './routes/project'
import speciesRouter from './routes/species'
import timeBoundRouter from './routes/timeBound'
import timeUnitRouter from './routes/timeUnit'
import userRouter from './routes/user'
import { responseLogger } from './middlewares/requestLogger'
import compression from 'compression'
import { logger } from './utils/logger'
import { PORT, BACKEND_MODE } from './utils/config'
import { tokenExtractor, userExtractor, requireLogin } from './middlewares/authenticator'
import { errorHandler } from './middlewares/errorHandler'
import { createTestUser } from './services/user'
import { testDbConnection } from './utils/db'

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(cors())
app.use(compression())
app.use(tokenExtractor)
app.use(userExtractor)
app.use(responseLogger)

app.use('/user', userRouter)
if (BACKEND_MODE !== 'dev') app.use(requireLogin)

app.use('/locality', localityRouter)
app.use('/reference', referenceRouter)
app.use('/region', regionRouter)
app.use('/person', personRouter)
app.use('/project', projectRouter)
app.use('/species', speciesRouter)
app.use('/time-bound', timeBoundRouter)
app.use('/time-unit', timeUnitRouter)
app.use('/museum', museumRouter)
app.use('/sedimentary-structure', sedimentaryStructureRouter)
app.use(errorHandler)
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT} in "${BACKEND_MODE}"-mode`)
  if (BACKEND_MODE === 'dev') {
    await testDbConnection()
    logger.info('Creating test-user...')
    void createTestUser()
  }
})
