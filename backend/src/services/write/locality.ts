import {
  EditDataType,
  LocalityDetailsType,
  LocalitySpeciesDetailsType,
  SpeciesDetailsType,
} from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from '../writeOperations/writeHandler'
import { DbValue } from './writeUtils'

export const writeLocality = async (locality: EditDataType<LocalityDetailsType>) => {
  const writeHandler = new WriteHandler(NOW_DB_NAME, 'now_loc')
  await writeHandler.start()
  for (const ls of locality.now_ls) {
    if (ls.rowState === 'new') {
      await writeLocalitySpecies(writeHandler, ls)
    } else if (ls.rowState === 'removed') {
      await deleteLocalitySpecies(writeHandler, ls.lid!, ls.species_id!)
    }
  }
}

/* Writes now_ls entries, and also any new species inside. */
const writeLocalitySpecies = async (
  writeHandler: WriteHandler,
  localitySpecies: EditDataType<LocalitySpeciesDetailsType>
) => {
  let species_id: DbValue | undefined = localitySpecies.com_species!.species_id
  if (!localitySpecies.species_id) {
    species_id = await writeSpecies(writeHandler, localitySpecies.com_species!)
  }
  if (species_id) localitySpecies.com_species!.species_id = species_id
  return await writeHandler.createObject('now_ls', localitySpecies, ['lid', 'species_id'])
}

const writeSpecies = async (writeHandler: WriteHandler, species: EditDataType<SpeciesDetailsType>) => {
  const { species_id } = await writeHandler.createObject('com_species', species, ['species_id'])
  return species_id as number
}

const deleteLocalitySpecies = async (writeHandler: WriteHandler, lid: number, species_id: number) => {
  return await writeHandler.delete('now_ls', [
    { column: 'lid', value: lid },
    { column: 'species_id', value: species_id },
  ])
}
