import { Museum, EditDataType } from '../../../../frontend/src/shared/types'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import Prisma from '../../../prisma/generated/now_test_client'
import { filterAllowedKeys, fixRadioSelection } from './writeOperations/utils'

export const writeMuseum = async (museum: EditDataType<Museum>) => {
  const allowedColumns = getFieldsOfTables(['com_mlist'])
  const filteredMuseum = filterAllowedKeys(museum, allowedColumns) as Prisma.com_mlist
  let museumId: string

  if (!filteredMuseum.museum) {
    const newMuseum = await nowDb.com_mlist.create({
      data: filteredMuseum,
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
