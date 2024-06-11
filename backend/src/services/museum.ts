import { nowDb } from '../utils/db'

export const getAllMuseums = async () => {
  const result = await nowDb.com_mlist.findMany({})
  return result
}
