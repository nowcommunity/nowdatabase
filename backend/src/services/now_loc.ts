import { models } from '../utils/db'
import logger from '../utils/logger'

export const testDb = async () => {
  const result = await models.now_loc.findAll({ attributes: ['loc_name'], where: { loc_name: 'Amba East' }, raw: true })
  if (result[0].loc_name === 'Amba East') {
    logger.info('Database connection tested, data can be fetched')
  } else {
    logger.error('Database connection does not work')
  }
}

export const getAllLocalities = async () => {
  // TODO: Send only public rows
  const result = await models.now_loc.findAll({ attributes: ['loc_name', 'max_age', 'min_age', 'country'], raw: true })
  return result
}
