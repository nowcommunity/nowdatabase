import { describe, expect, it, jest } from '@jest/globals'
import { validateCollectingMethodValues } from '../../utils/validation/collectingMethodValues'
import { nowDb } from '../../utils/db'
import { CollectingMethod, Editable } from '../../../../frontend/src/shared/types'

jest.mock('../../utils/db', () => ({
  nowDb: {
    now_coll_meth_values: {
      findMany: jest.fn(),
    },
  },
  logDb: {},
}))

const mockedNowDb = jest.mocked(nowDb)

describe('validateCollectingMethodValues', () => {
  it('returns null when no collecting methods are provided', async () => {
    const result = await validateCollectingMethodValues(undefined)

    expect(result).toBeNull()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedNowDb.now_coll_meth_values.findMany).not.toHaveBeenCalled()
  })

  it('returns null when all collecting methods are valid', async () => {
    const collectingMethods: Array<Editable<CollectingMethod>> = [{ coll_meth: 'surface', lid: 1, rowState: 'new' }]
    mockedNowDb.now_coll_meth_values.findMany.mockResolvedValueOnce([{ coll_meth_value: 'surface' }])

    const result = await validateCollectingMethodValues(collectingMethods)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedNowDb.now_coll_meth_values.findMany).toHaveBeenCalledWith({
      select: { coll_meth_value: true },
    })
    expect(result).toBeNull()
  })

  it('returns a validation error for unknown collecting methods', async () => {
    const collectingMethods: Array<Editable<CollectingMethod>> = [
      { coll_meth: 'not_real', lid: 1, rowState: 'new' },
      { coll_meth: 'surface', lid: 1, rowState: 'new' },
    ]
    mockedNowDb.now_coll_meth_values.findMany.mockResolvedValueOnce([{ coll_meth_value: 'surface' }])

    const result = await validateCollectingMethodValues(collectingMethods)

    expect(result).toEqual({
      name: 'now_coll_meth',
      error: 'Collecting method value(s) not recognized: not_real',
    })
  })
})
