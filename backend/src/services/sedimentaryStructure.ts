import { dbClient } from '../utils/db'

export const getAllSedimentaryStructures = async () => {
  const result = await dbClient.now_ss_values.findMany({})
  return result
}
