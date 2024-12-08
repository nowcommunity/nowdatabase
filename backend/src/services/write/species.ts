import { EditDataType, FixBigInt, Reference, SpeciesDetailsType, User } from '../../../../frontend/src/shared/types/dbTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from './writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'
import { ActionType } from './writeOperations/types'
import { getSpeciesDetails } from '../species'
import { makeListRemoved } from './writeOperations/utils'

const getSpeciesWriteHandler = (type: ActionType) => {
  return new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'com_species',
    idColumn: 'species_id',
    allowedColumns: getFieldsOfTables(['com_species', 'now_ls', 'now_sau', 'now_lau']),
    type,
  })
}

export const writeSpecies = async (
  species: EditDataType<SpeciesDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  const writeHandler = getSpeciesWriteHandler(species.species_id ? 'update' : 'add')
  try {
    await writeHandler.start()

    if (!species.species_id) {
      const { species_id: newId } = await writeHandler.createObject('com_species', species, ['species_id'])
      species.species_id = newId as number
    } else {
      await writeHandler.updateObject('com_species', species, ['species_id'])
    }

    writeHandler.idValue = species.species_id

    await writeHandler.applyListChanges('now_ls', species.now_ls, ['lid', 'species_id'])
    await writeHandler.applyListChanges('com_taxa_synonym', species.com_taxa_synonym, ['synonym_id', 'species_id'])
    await writeHandler.logUpdatesAndComplete(authorizer, comment ?? '', references ?? [])

    return species.species_id
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}

export const deleteSpecies = async (species_id: number, user: User) => {
  const species = (await getSpeciesDetails(species_id)) as EditDataType<FixBigInt<SpeciesDetailsType>>
  if (!species) throw new Error('Species not found')

  const writeHandler = getSpeciesWriteHandler('delete')
  await writeHandler.start()
  writeHandler.idValue = species.species_id

  makeListRemoved(species.now_ls)
  makeListRemoved(species.com_taxa_synonym)
  makeListRemoved(species.now_sau)

  try {
    await writeHandler.applyListChanges('now_ls', species.now_ls, ['lid', 'species_id'])
    await writeHandler.applyListChanges('com_taxa_synonym', species.com_taxa_synonym, ['synonym_id', 'species_id'])
    await writeHandler.applyListChanges('now_sau', species.now_sau, ['suid'])
    await writeHandler.deleteObject('com_species', species, ['species_id'])
    await writeHandler.logUpdatesAndComplete(user.initials)
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}
