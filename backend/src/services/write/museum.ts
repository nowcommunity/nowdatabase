import { Museum, EditDataType } from '../../../../frontend/src/shared/types'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import Prisma from '../../../prisma/generated/now_test_client'
import { filterAllowedKeys, fixRadioSelection } from './writeOperations/utils'
import { getMuseumDetails } from '../museum'

export class DuplicateMuseumCodeError extends Error {
  declare status: number
  code: 'duplicate_museum_code'

  constructor(message: string) {
    super(message)
    this.status = 409
    this.code = 'duplicate_museum_code'
  }
}

export const writeMuseum = async (museum: EditDataType<Museum>) => {
  const allowedColumns = getFieldsOfTables(['com_mlist'])
  const filteredMuseum = filterAllowedKeys(museum, allowedColumns) as Prisma.com_mlist
  let museumId: string

  const allMuseums = await nowDb.com_mlist.findMany({
    select: { museum: true },
  })

  const duplicateByCase = allMuseums.find(
    existingMuseum =>
      existingMuseum.museum.toLowerCase() === filteredMuseum.museum.toLowerCase() &&
      existingMuseum.museum !== filteredMuseum.museum
  )

  if (duplicateByCase) {
    throw new DuplicateMuseumCodeError('Museum code already exists (case-insensitive match)')
  }

  const existingMuseum = await getMuseumDetails(filteredMuseum.museum)

  if (!existingMuseum) {
    const newMuseum = await nowDb.com_mlist.create({
      data: {
        ...filteredMuseum,
        used_morph: fixRadioSelection(filteredMuseum.used_morph),
        used_now: fixRadioSelection(filteredMuseum.used_now),
        used_gene: fixRadioSelection(filteredMuseum.used_gene),
      },
    })
    museumId = newMuseum.museum
  } else {
    await nowDb.com_mlist.update({
      where: { museum: museum.museum },
      data: {
        ...filteredMuseum,
        used_morph: fixRadioSelection(filteredMuseum.used_morph),
        used_now: fixRadioSelection(filteredMuseum.used_now),
        used_gene: fixRadioSelection(filteredMuseum.used_gene),
      },
    })
    museumId = filteredMuseum.museum
  }

  return museumId
}
