import { Locality, Museum, EditDataType, EditMetaData } from '../../../frontend/src/shared/types'
import { nowDb } from '../utils/db'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import Prisma from '../../prisma/generated/now_test_client'
import { validateMuseum } from '../../../frontend/src/shared/validators/museum'

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

export const validateEntireMuseum = (editedFields: EditDataType<Prisma.com_mlist> & EditMetaData) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateMuseum(editedFields as EditDataType<Museum>, key as keyof Museum)
    if (error.error) errors.push(error)
  }
  return errors
}
