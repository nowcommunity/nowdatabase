import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import crossSearchRouter from './routes/crossSearch'
import localityRouter from './routes/locality'
import museumRouter from './routes/museum'
import referenceRouter from './routes/reference'
import sedimentaryStructureRouter from './routes/sedimentaryStructure'
import regionRouter from './routes/region'
import personRouter from './routes/person'
import projectRouter from './routes/project'
import speciesRouter from './routes/species'
import localitySpeciesRouter from './routes/localitySpecies'
import refreshTokenRouter from './routes/refresh'
import timeBoundRouter from './routes/timeBound'
import timeUnitRouter from './routes/timeUnit'
import userRouter from './routes/user'
import emailRouter from './routes/email'
import versionRouter from './routes/version'
import geonamesRouter from './routes/geonames-api'
import { responseLogger } from './middlewares/requestLogger'
import compression from 'compression'
import { ENABLE_WRITE, RUNNING_ENV } from './utils/config'
import { tokenExtractor, userExtractor } from './middlewares/authenticator'
import { errorHandler } from './middlewares/errorHandler'
import { requireOneOf } from './middlewares/authorizer'
import { Role } from './../../frontend/src/shared/types'
import { blockWriteRequests } from './middlewares/misc'
import testRouter from './routes/test'

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(cors())
app.use(compression())

app.use(responseLogger)

if (!ENABLE_WRITE && RUNNING_ENV !== 'dev') {
  app.use(blockWriteRequests)
}

app.use(refreshTokenRouter)

app.use(tokenExtractor)
app.use(userExtractor)

app.use('/user', userRouter)
app.use('/crosssearch', crossSearchRouter)
app.use('/locality', localityRouter)
app.use('/locality-species', localitySpeciesRouter)
app.use('/species', speciesRouter)
app.use('/reference', referenceRouter)
app.use('/time-unit', timeUnitRouter)
app.use('/time-bound', requireOneOf([Role.Admin, Role.EditUnrestricted]), timeBoundRouter)
app.use('/region', requireOneOf([Role.Admin]), regionRouter)
app.use('/person', personRouter)
app.use('/project', projectRouter)
app.use('/museum', museumRouter)
app.use('/sedimentary-structure', sedimentaryStructureRouter)
app.use('/email', emailRouter)
app.use('/version', versionRouter)
app.use('/geonames-api', geonamesRouter)
if (RUNNING_ENV === 'dev') app.use('/test', testRouter)

export const dateWhenStarted = new Date(Date.now())

app.use(errorHandler)

export default app
