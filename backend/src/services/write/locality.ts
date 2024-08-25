import { EditDataType, LocalityDetailsType } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from '../writeOperations/writeHandler'

export const writeLocality = async (locality: EditDataType<LocalityDetailsType>) => {
  const writeHandler = new WriteHandler(NOW_DB_NAME, 'now_loc', 'lid')
  await writeHandler.start()

  if (!locality.lid) {
    const { lid: newLid } = await writeHandler.createObject('now_loc', locality, ['lid'])
    locality.lid = newLid as number
  }

  writeHandler.idValue = locality.lid

  /* Write possible new species of now_ls, and save those id's to now_ls objects */
  for (const localitySpecies of locality.now_ls) {
    const species = localitySpecies.com_species!
    if (species.species_id) continue
    const { species_id } = await writeHandler.createObject('com_species', species, ['species_id'])
    species.species_id = species_id as number
  }

  await writeHandler.upsertList('now_ls', locality.now_ls, ['lid', 'species_id'])
  await writeHandler.upsertList('now_mus', locality.now_mus, ['lid', 'museum'])
  await writeHandler.upsertList('now_ss', locality.now_ss, ['lid', 'sed_struct'])
  await writeHandler.upsertList('now_coll_meth', locality.now_coll_meth, ['lid', 'coll_meth'])
  await writeHandler.upsertList('now_syn_loc', locality.now_syn_loc, ['lid', 'syn_id'])

  await writeHandler.end()
  return locality.lid
}
