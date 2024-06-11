import { nowDb } from '../utils/db'

export const getAllSedimentaryStructures = async () => {
  const result = await nowDb.now_ss_values.findMany({})
  return result
}
