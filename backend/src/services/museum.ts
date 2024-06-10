import { dbClient } from '../utils/db'

export const getAllMuseums = async () => {
  const result = await dbClient.com_mlist.findMany({})
  return result
}
