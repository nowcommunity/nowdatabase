import { EditDataType, LocalityDetailsType, LocalitySpecies } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { getItemList } from '../writeOperations/utils'
import { WriteHandler } from '../writeOperations/writeHandler'

export const writeLocality = async (locality: EditDataType<LocalityDetailsType>) => {
  const isNew: boolean = !!locality.lid
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
const writeLocalitySpecies = async (writeHandler: WriteHandler, localitySpecies: EditDataType<LocalitySpecies>) => {
  if (!localitySpecies.species_id) {
    // const { species_id } = await writeHandler.writeTable('com_species', )
  }
  const items = getItemList(localitySpecies)
  return await writeHandler.writeTable('now_ls', items, [], ['lid', 'species_id'])
}

const deleteLocalitySpecies = async (writeHandler: WriteHandler, lid: number, species_id: number) => {
  return await writeHandler.delete('now_ls', [
    { column: 'lid', value: lid },
    { column: 'species_id', value: species_id },
  ])
}
