import { EditDataType, SpeciesDetailsType } from '../../../frontend/src/backendTypes'
import { validateSpecies } from '../../../frontend/src/validators/species'
import { ValidationObject } from '../../../frontend/src/validators/validator'
import Prisma from '../../prisma/generated/now_test_client'
import { fixBigInt } from '../utils/common'
import { logDb, nowDb } from '../utils/db'

export const getAllSpecies = async () => {
  const result = await nowDb.com_species.findMany({
    select: {
      species_id: true,
      subclass_or_superorder_name: true,
      order_name: true,
      suborder_or_superfamily_name: true,
      family_name: true,
      subfamily_name: true,
      genus_name: true,
      species_name: true,
      unique_identifier: true,
      taxonomic_status: true,
      common_name: true,
      sp_author: true,
      strain: true,
      gene: true,
      body_mass: true,
      brain_mass: true,
      sp_status: true,
    },
  })

  return result
}

export const getSpeciesDetails = async (id: number) => {
  const result = await nowDb.com_species.findUnique({
    where: { species_id: id },
    include: {
      now_ls: {
        include: {
          now_loc: true,
        },
      },
      now_sau: {
        include: {
          now_sr: {
            include: {
              ref_ref: {
                include: {
                  ref_authors: true,
                  ref_journal: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!result) return null

  const synonyms = await nowDb.com_taxa_synonym.findMany({ where: { species_id: id } })

  const suids = result.now_sau.map(sau => sau.suid)

  const logResult = await logDb.log.findMany({ where: { suid: { in: suids } } })

  result.now_sau = result.now_sau.map(sau => ({
    ...sau,
    updates: logResult.filter(logRow => logRow.suid === sau.suid),
  }))

  return JSON.parse(fixBigInt({ ...result, com_taxa_synonym: synonyms || [] })!) as SpeciesDetailsType
}

export const validateEntireSpecies = (editedFields: EditDataType<Prisma.com_species>) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateSpecies(editedFields as EditDataType<SpeciesDetailsType>, key as keyof SpeciesDetailsType)
    if (error.error) errors.push(error)
  }
  return errors
}
