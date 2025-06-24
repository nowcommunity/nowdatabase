import { EditDataType, EditMetaData, SpeciesDetailsType } from '../../../frontend/src/shared/types'
import { validateSpecies } from '../../../frontend/src/shared/validators/species'
import { ValidationObject, referenceValidator } from '../../../frontend/src/shared/validators/validator'
import Prisma from '../../prisma/generated/now_test_client'
import { fixBigInt } from '../utils/common'
import { logDb, nowDb } from '../utils/db'
import { getReferenceDetails } from './reference'

export const getAllSpecies = async () => {
  const speciesResult = await nowDb.com_species.findMany({
    select: {
      species_id: true,
      order_name: true,
      family_name: true,
      genus_name: true,
      species_name: true,
      subclass_or_superorder_name: true,
      suborder_or_superfamily_name: true,
      subfamily_name: true,
      unique_identifier: true,
      taxonomic_status: true,
      sv_length: true,
      body_mass: true,
      sd_size: true,
      sd_display: true,
      tshm: true,
      tht: true,
      horizodonty: true,
      crowntype: true,
      cusp_shape: true,
      cusp_count_buccal: true,
      cusp_count_lingual: true,
      loph_count_lon: true,
      loph_count_trs: true,
      fct_al: true,
      fct_ol: true,
      fct_sf: true,
      fct_ot: true,
      fct_cm: true,
      microwear: true,
      mesowear: true,
      mw_or_high: true,
      mw_or_low: true,
      mw_cs_sharp: true,
      mw_cs_round: true,
      mw_cs_blunt: true,
      diet1: true,
      diet2: true,
      diet3: true,
      locomo1: true,
      locomo2: true,
      locomo3: true,
      sp_comment: true,
    },
  })

  const synonyms: { species_id: number }[] = await nowDb.com_taxa_synonym.findMany({
    select: { species_id: true },
    distinct: ['species_id'],
  })

  const synonymIdSet = new Set(synonyms.map(s => s.species_id))
  const result = speciesResult.map(sp => ({
    ...sp,
    has_synonym: synonymIdSet.has(sp.species_id),
  }))

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
            select: {
              ref_ref: {
                select: {
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

export const validateEntireSpecies = async (editedFields: EditDataType<Prisma.com_species> & EditMetaData) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateSpecies(editedFields as EditDataType<SpeciesDetailsType>, key as keyof SpeciesDetailsType)
    if (error.error) errors.push(error)
  }
  let error = null
  if ('references' in editedFields && editedFields.references) {
    error = referenceValidator(editedFields.references)
    const invalidReferences: number[] = []
    for (const reference of editedFields.references) {
      const result = await getReferenceDetails(reference.rid)
      if (!result) {
        invalidReferences.push(reference.rid)
      }
    }
    if (invalidReferences.length > 0) {
      error = `References with ID(s) ${invalidReferences.join(', ')} do not exist`
    }
  } else {
    error = 'references-key is undefined in the data'
  }

  if (error) errors.push({ name: 'references', error: error })
  return errors
}
