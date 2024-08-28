import { EditDataType, Reference, SpeciesDetailsType } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from '../writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'

export const writeSpecies = async (
  species: EditDataType<SpeciesDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  const writeHandler = new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'com_species',
    idColumn: 'species_id',
    allowedColumns: getFieldsOfTables(['com_species', 'now_ls']),
    type: species.species_id ? 'update' : 'add',
  })

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
    await writeHandler.logUpdatesAndComplete(comment ?? '', references ?? [], authorizer)
    await writeHandler.commit()

    return species.species_id
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}
