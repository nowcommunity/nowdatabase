import { EditDataType, LocalityDetailsType, Reference, User } from '../../../../frontend/src/shared/types'
import { getHomininSkeletalRemains } from '../../../../frontend/src/shared/calculations'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from './writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'
import { getLocalityDetails, filterDuplicateLocalitySpecies } from '../locality'
import { ActionType } from './writeOperations/types'
import { makeListRemoved, fixRadioSelection } from './writeOperations/utils'

const getLocalityWriteHandler = (type: ActionType) => {
  return new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'now_loc',
    idColumn: 'lid',
    allowedColumns: getFieldsOfTables([
      'now_loc',
      'now_ls',
      'com_species',
      'now_mus',
      'now_ss',
      'now_coll_meth',
      'now_syn_loc',
      'now_lau',
      'now_sau',
    ]),
    type,
  })
}

export const writeLocality = async (
  locality: EditDataType<LocalityDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  user: User | undefined
) => {
  const updateOrAdd = locality.lid ? 'update' : 'add'
  const writeHandler = getLocalityWriteHandler(updateOrAdd)

  locality.hominin_skeletal_remains = getHomininSkeletalRemains(locality)

  locality.loc_status = fixRadioSelection(locality.loc_status)
  locality.approx_coord = fixRadioSelection(locality.approx_coord)
  locality.stone_tool_cut_marks_on_bones = fixRadioSelection(locality.stone_tool_cut_marks_on_bones) as boolean
  locality.bipedal_footprints = fixRadioSelection(locality.bipedal_footprints) as boolean
  locality.stone_tool_technology = fixRadioSelection(locality.stone_tool_technology) as boolean

  const authorizer = user!.initials

  try {
    await writeHandler.start()

    const filteredLocality = await filterDuplicateLocalitySpecies(locality, user)
    if (updateOrAdd === 'update' && filteredLocality) {
      locality.now_ls = filteredLocality
    }

    if (updateOrAdd === 'add') {
      const { lid: newLid } = await writeHandler.createObject('now_loc', locality, ['lid'])
      locality.lid = newLid as number
    } else {
      await writeHandler.updateObject('now_loc', locality, ['lid'])
    }

    writeHandler.idValue = locality.lid

    /* Write possible new species of now_ls, and save those id's to now_ls objects */
    for (const localitySpecies of locality.now_ls) {
      const species = localitySpecies.com_species!
      if (species.species_id) continue
      const { species_id } = await writeHandler.createObject('com_species', species, ['species_id'])
      species.species_id = species_id as number
      localitySpecies.species_id = species_id as number
    }

    await writeHandler.applyListChanges('now_ls', locality.now_ls, ['lid', 'species_id'])
    await writeHandler.applyListChanges('now_mus', locality.now_mus, ['lid', 'museum'])
    await writeHandler.applyListChanges('now_ss', locality.now_ss, ['lid', 'sed_struct'])
    await writeHandler.applyListChanges('now_coll_meth', locality.now_coll_meth, ['lid', 'coll_meth'])
    await writeHandler.applyListChanges('now_syn_loc', locality.now_syn_loc, ['lid', 'syn_id'])

    await writeHandler.logUpdatesAndComplete(authorizer, comment ?? '', references ?? [])
    return locality.lid
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}

export const deleteLocality = async (lid: number, user: User) => {
  const locality = (await getLocalityDetails(lid, user)) as EditDataType<LocalityDetailsType>
  if (!locality) throw new Error('Locality not found')

  const writeHandler = getLocalityWriteHandler('delete')
  await writeHandler.start()
  writeHandler.idValue = locality.lid

  makeListRemoved(locality.now_ls)
  makeListRemoved(locality.now_mus)
  makeListRemoved(locality.now_ss)
  makeListRemoved(locality.now_coll_meth)
  makeListRemoved(locality.now_syn_loc)

  try {
    await writeHandler.applyListChanges('now_ls', locality.now_ls, ['lid', 'species_id'])
    await writeHandler.applyListChanges('now_mus', locality.now_mus, ['lid', 'museum'])
    await writeHandler.applyListChanges('now_ss', locality.now_ss, ['lid', 'sed_struct'])
    await writeHandler.applyListChanges('now_coll_meth', locality.now_coll_meth, ['lid', 'coll_meth'])
    await writeHandler.applyListChanges('now_syn_loc', locality.now_syn_loc, ['lid', 'syn_id'])
    await writeHandler.deleteObject('now_loc', locality, ['lid'])
    await writeHandler.logUpdatesAndComplete(user.initials)
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}

export const writeLocalityCascade = async (
  locality: EditDataType<LocalityDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  const writeHandler = getLocalityWriteHandler('update')
  try {
    await writeHandler.start()
    await writeHandler.updateObject('now_loc', locality, ['lid'])
    writeHandler.idValue = locality.lid
    await writeHandler.logUpdatesAndComplete(authorizer, comment ?? '', references ?? [])
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}
