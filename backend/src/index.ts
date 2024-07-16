import 'express-async-errors'
import express from 'express'
import cors from 'cors'
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
import { ENABLE_WRITE, PORT, RUNNING_ENV } from './utils/config'
import { tokenExtractor, userExtractor } from './middlewares/authenticator'
import { errorHandler } from './middlewares/errorHandler'
import { createTestUsers } from './services/user'
import { testDbConnection } from './utils/db'
import { requireOneOf } from './middlewares/authorizer'
import { Role } from './../../frontend/src/types'
import { blockWriteRequests } from './middlewares/misc'

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(cors())
app.use(compression())
app.use(responseLogger)

if (!ENABLE_WRITE && RUNNING_ENV !== 'dev') {
  app.use(blockWriteRequests)
}
app.use(tokenExtractor)
app.use(userExtractor)

app.use('/user', userRouter)
app.use('/locality', localityRouter)
app.use('/species', speciesRouter)
app.use('/reference', referenceRouter)
app.use('/time-unit', timeUnitRouter)
app.use('/time-bound', requireOneOf([Role.Admin]), timeBoundRouter)
app.use('/region', requireOneOf([Role.Admin]), regionRouter)
app.use('/person', personRouter)
app.use('/project', projectRouter)
app.use('/museum', museumRouter)
app.use('/sedimentary-structure', sedimentaryStructureRouter)
app.use(errorHandler)
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT} in "${RUNNING_ENV}"-mode`)
  if (RUNNING_ENV === 'dev') {
    await testDbConnection()
    logger.info('Creating test-users...')
    void createTestUsers()
  }
})
