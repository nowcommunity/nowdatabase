import { EditDataType, RegionCountry, RegionDetails, RegionCoordinator } from '../../../../frontend/src/shared/types'
import Prisma from '../../../prisma/generated/now_test_client'
import { nowDb, getFieldsOfTables } from '../../utils/db'
import { getRegionDetails } from '../region'
import { filterAllowedKeys } from './writeOperations/utils'

export const writeRegionCountries = async (regionId: number, countries: EditDataType<RegionCountry[]>) => {
  const allowedColumns = getFieldsOfTables(['now_reg_coord_country'])
  await nowDb.$transaction(async prisma => {
    await prisma.now_reg_coord_country.deleteMany({
      where: { reg_coord_id: regionId },
    })

    for (const country of countries) {
      const filteredCountry = filterAllowedKeys(country, allowedColumns) as Prisma.now_reg_coord_country
      await prisma.now_reg_coord_country.create({
        data: {
          reg_coord_id: regionId,
          country: filteredCountry.country,
        },
      })
    }
  })
}

export const writeRegionCoordinators = async (regionId: number, coordinators: EditDataType<RegionCoordinator[]>) => {
  const allowedColumns = getFieldsOfTables(['now_reg_coord_people'])
  await nowDb.$transaction(async prisma => {
    await prisma.now_reg_coord_people.deleteMany({
      where: { reg_coord_id: regionId },
    })

    for (const coordinator of coordinators) {
      const filteredCoordinator = filterAllowedKeys(coordinator, allowedColumns) as Prisma.now_reg_coord_people

      await prisma.now_reg_coord_people.create({
        data: {
          reg_coord_id: regionId,
          initials: filteredCoordinator.initials,
        },
      })
    }
  })
}

export const writeRegion = async (region: EditDataType<RegionDetails>) => {
  const allowedColumns = getFieldsOfTables(['now_reg_coord', 'now_reg_coord_country', 'now_reg_coord_people'])
  const filteredRegion = filterAllowedKeys(region, allowedColumns) as Prisma.now_reg_coord
  let regionId: number

  if (!filteredRegion.reg_coord_id) {
    const newRegion = await nowDb.now_reg_coord.create({
      data: filteredRegion,
    })
    regionId = newRegion.reg_coord_id
  } else {
    await nowDb.now_reg_coord.update({
      where: { reg_coord_id: region.reg_coord_id },
      data: filteredRegion,
    })
    regionId = filteredRegion.reg_coord_id
  }

  if (region.now_reg_coord_country) {
    const countriesToWrite = region.now_reg_coord_country.filter(region => region.rowState !== 'removed')
    await writeRegionCountries(regionId, countriesToWrite)
  }

  if (region.now_reg_coord_people) {
    const coordinatorsToWrite = region.now_reg_coord_people.filter(coordinator => coordinator.rowState !== 'removed')
    await writeRegionCoordinators(regionId, coordinatorsToWrite)
  }

  return regionId
}

export const deleteRegion = async (regionId: number) => {
  const region = await getRegionDetails(regionId)

  if (!region) throw new Error('Region not found')

  await nowDb.$transaction(async prisma => {
    await prisma.now_reg_coord_country.deleteMany({
      where: { reg_coord_id: regionId },
    })

    await prisma.now_reg_coord_people.deleteMany({
      where: { reg_coord_id: regionId },
    })

    try {
      await prisma.now_reg_coord.delete({
        where: { reg_coord_id: regionId },
      })
    } catch (error) {
      throw new Error('Failed to delete the region')
    }
  })
}
