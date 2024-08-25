import { EditDataType, SpeciesDetailsType } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from '../writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'

export const writeSpecies = async (species: EditDataType<SpeciesDetailsType>) => {
  const writeHandler = new WriteHandler(
    NOW_DB_NAME,
    'com_species',
    'species_id',
    getFieldsOfTables(['com_species', 'now_ls'])
  )

  await writeHandler.start()

  if (!species.species_id) {
    const { species_id: newId } = await writeHandler.createObject('com_species', species, ['species_id'])
    species.species_id = newId as number
  } else {
    await writeHandler.updateObject('com_species', species, ['species_id'])
  }

  writeHandler.idValue = species.species_id

  await writeHandler.upsertList('now_ls', species.now_ls, ['lid', 'species_id'])
  await writeHandler.upsertList('com_taxa_synonym', species.com_taxa_synonym, ['synonym_id', 'species_id'])
  console.log(JSON.stringify(writeHandler.writeList))
  await writeHandler.logUpdates()
  await writeHandler.end()
  return species.species_id
}
