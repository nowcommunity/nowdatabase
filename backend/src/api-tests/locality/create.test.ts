import { beforeEach, beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { LocalityDetailsType, SpeciesDetailsType } from '../../../../frontend/src/shared/types'
import { LogRow } from '../../services/write/writeOperations/types'
import { newLocalityBasis } from './data'
import { login, logout, resetDatabase, send, testLogRows, resetDatabaseTimeout, noPermError } from '../utils'
import { pool } from '../../utils/db'

let createdLocality: LocalityDetailsType | null = null

describe.only('Creating new locality works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody } = await send<{ id: number }>('locality', 'PUT', { locality: newLocalityBasis })
    const { id: createdId } = resultBody

    expect(typeof createdId).toEqual('number') // `Invalid result returned on write: ${createdId}`)

    const { body } = await send<LocalityDetailsType>(`locality/${createdId}`, 'GET')
    expect(body).not.toEqual({})
    createdLocality = body
  })

  it('Contains correct data', () => {
    const { loc_name, now_ls, stone_tool_cut_marks_on_bones, bipedal_footprints, stone_tool_technology } =
      createdLocality!
    expect(loc_name).toEqual(newLocalityBasis.loc_name) //'Name is different'
    expect(stone_tool_cut_marks_on_bones).toEqual(true) //'Stone tool cut marks on bones is different'
    expect(bipedal_footprints).toEqual(false) //'Bipedal footprints is different'
    expect(stone_tool_technology).toEqual(false) //'Stone tool technology is different'
    const newSpecies = now_ls.find(ls => ls.com_species.species_name === 'Newspecies')
    expect(!!newSpecies).toEqual(true) // 'New species not found'
    const oldSpecies = now_ls.find(ls => ls.species_id === 21052 && ls.lid === createdLocality!.lid)
    expect(!!oldSpecies).toEqual(true) // 'Old species not found'
  })

  it('Creation fails without permissions', async () => {
    logout()
    const resultNoPerm = await send('locality', 'PUT', {
      locality: { ...newLocalityBasis },
    })
    expect(resultNoPerm.body).toEqual(noPermError)
    expect(resultNoPerm.status).toEqual(403)

    logout()
    await login('testEr', 'test')
    const resultEr = await send('locality', 'PUT', {
      locality: { ...newLocalityBasis },
    })
    expect(resultEr.body).toEqual(noPermError)
    expect(resultEr.status).toEqual(403)
  })

  it('Creation fails without reference', async () => {
    const resultNoRef = await send('locality', 'PUT', {
      locality: { ...newLocalityBasis, references: [] },
    })
    expect(resultNoRef.status).toEqual(403) // can't create one without a reference

    const resultWithRef = await send('locality', 'PUT', {
      locality: { ...newLocalityBasis },
    })
    expect(resultWithRef.status).toEqual(200)
  })

  it('Species update also logged correctly', async () => {
    const speciesId = createdLocality!.now_ls.find(ls => ls.com_species.species_name === 'Newspecies')?.species_id
    const speciesResult = await send<SpeciesDetailsType>(`species/${speciesId}`, 'GET')
    const update = speciesResult.body.now_sau.find(update => update.sau_comment === 'new locality test update')
    if (!update) throw new Error('Species update not found')
    if (!speciesId) throw new Error('Species id not found')
    expect(update?.species_id).toEqual(speciesId) // 'Species update does not have correct id'
    const logRows = update.updates
    const expectedLogRows: Partial<LogRow>[] = [
      {
        oldValue: null,
        value: 'Newspecies',
        type: 'add',
        column: 'species_name',
        table: 'com_species',
      },
      {
        oldValue: null,
        value: speciesId.toString(),
        type: 'add',
        column: 'species_id',
        table: 'com_species',
      },
      {
        oldValue: null,
        value: speciesId.toString(),
        type: 'add',
        column: 'species_id',
        table: 'now_ls',
      },
      {
        oldValue: null,
        value: createdLocality!.lid.toString(),
        type: 'add',
        column: 'lid',
        table: 'now_ls',
      },
    ]
    testLogRows(logRows, expectedLogRows, 4)
  })

  it('Sends multiple validation errors', async () => {
    const result = await send<{ id: number }>('locality', 'PUT', {
      locality: {
        bfa_max: 'bahean',
        bfa_min: 'bahean',
        loc_name: 'Lantian-Shuijiazui',
        date_meth: 'time_unit',
        max_age: 5,
        min_age: 8,
        bfa_max_abs: null,
        bfa_min_abs: null,
        frac_max: null,
        frac_min: null,
        comment: '',
        references: [],
      },
    })
    expect(result.status === 403)
    const body = result.body
    expect(Array.isArray(body))
    const expectedErrors = [
      {
        name: 'Country',
        error: 'This field is required',
      },
      {
        name: 'Latitude (dms)',
        error: 'This field is required',
      },
      {
        name: 'Latitude (dec)',
        error: 'This field is required',
      },
      {
        name: 'Longitude (dms)',
        error: 'This field is required',
      },
      {
        name: 'Longitude (dec)',
        error: 'This field is required',
      },
      {
        name: 'references',
        error: 'There must be at least one reference',
      },
    ]
    for (const expectedError of expectedErrors) {
      expect(body).toEqual(expect.arrayContaining([expect.objectContaining(expectedError)]))
    }
  })
})
