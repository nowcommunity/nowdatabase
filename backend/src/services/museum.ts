import { Museum } from '../../../frontend/src/shared/types'
import { fixBigInt } from '../utils/common'
import { nowDb } from '../utils/db'

export const getAllMuseums = async () => {
  const result = await nowDb.com_mlist.findMany({})
  return result
}

export const getMuseumDetails = async (id: string) => {
  const result = (await nowDb.com_mlist.findUnique({
    where: {
      museum: id,
    },
  })) as Museum

  if (!result) return null

  return JSON.parse(fixBigInt(result)!) as Museum
}
