import app from './app'
import { PORT, RUNNING_ENV } from './utils/config'
import { testDbConnection } from './utils/db'
import { logger } from './utils/logger'

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT} in "${RUNNING_ENV}"-mode.`)
  if (RUNNING_ENV === 'dev') {
    await testDbConnection()
  }
})
