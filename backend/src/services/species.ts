//import { com_mlist } from '../models/com_mlist'
import { models } from '../utils/db'
//import { logger } from '../utils/logger'

/*export const testDb = async () => {
  const result = await models.now_loc.findAll({ attributes: ['loc_name'], where: { loc_name: 'Amba East' }, raw: true })
  if (result[0].loc_name === 'Amba East') {
    logger.info('Database connection tested, data can be fetched')
  } else {
    logger.error('Database connection does not work')
  }
}
*/
export const getAllSpecies = async (onlyPublic: boolean) => {
  const where = onlyPublic ? { sp_status: 0 } : {}

  const result = await models.com_species.findAll({
    attributes: [
      'species_id',
      'subclass_or_superorder_name',
      'order_name',
      'suborder_or_superfamily_name',
      'family_name',
      'subfamily_name',
      'genus_name',
      'species_name',
      'unique_identifier'],
    where,
  })
  return result
}

export const getSpeciesDetails = async (id: number) => {
  // TODO: Check if user has access
  const result = await models.com_species.findByPk(id)
  return result
}
