import { ActivityStatistic, Statistics } from '../../../frontend/src/shared/types'
import { Prisma } from '../../prisma/generated/now_test_client'
import { nowDb } from '../utils/db'

export const getStatistics = async (): Promise<Statistics> => {
  const localityAggregate = await nowDb.now_loc.aggregate({
    _count: {
      lid: true,
    },
  })
  const localityCount = localityAggregate._count.lid

  const speciesAggregate = await nowDb.com_species.aggregate({
    _count: {
      species_id: true,
    },
  })
  const speciesCount = speciesAggregate._count.species_id

  const localitySpeciesQuery = Prisma.sql`
    SELECT COUNT(now_ls.species_id) as count 
    FROM now_loc 
    LEFT JOIN now_ls ON now_ls.lid = now_loc.lid
  `

  const localitySpeciesAggregate: { count: number }[] = await nowDb.$queryRaw(localitySpeciesQuery)
  let localitySpeciesCount = 0

  if (localitySpeciesAggregate.length > 0) {
    localitySpeciesCount = localitySpeciesAggregate[0].count
  }

  return {
    localityCount,
    speciesCount,
    localitySpeciesCount,
  }
}

export const getLocalityStatistics = async (): Promise<ActivityStatistic[]> => {
  const query = Prisma.sql`SELECT * FROM now_v_locality_statistics LIMIT 10`
  return await nowDb.$queryRaw(query)
}

export const getSpeciesStatistics = async (): Promise<ActivityStatistic[]> => {
  const query = Prisma.sql`SELECT * FROM now_v_species_statistics LIMIT 10`
  return await nowDb.$queryRaw(query)
}
