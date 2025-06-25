import { Locality } from '../../../frontend/src/shared/types'
import { nowDb } from '../utils/db'

export const getAllMuseums = async () => {
  const result = await nowDb.com_mlist.findMany({})
  return result
}

export const getMuseumDetails = async (id: string) => {
  const museum = await nowDb.com_mlist.findUnique({
    where: { museum: id },
  })

  if (!museum) return null

  const localityLinks = await nowDb.now_mus.findMany({
    where: { museum: id },
    select: { lid: true },
  })

  const localityIds = localityLinks.map(link => link.lid)

  const localities = (await nowDb.now_loc.findMany({
    where: { lid: { in: localityIds } },
  })) as Locality[]

  const combined = {
    ...museum,
    localities,
  }

  return combined
}
