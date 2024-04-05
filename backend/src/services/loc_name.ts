import { models } from '../utils/db'
import logger from '../utils/logger'

export const testDb = async () => {
  const result = await models.now_loc.findAll({ attributes: ['loc_name'], where: { loc_name: 'Amba East' }, raw: true })
  logger.info(JSON.stringify(result, null, 2))
}
