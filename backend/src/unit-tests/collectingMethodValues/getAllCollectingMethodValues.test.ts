import { describe, expect, it, jest } from '@jest/globals'
import { getAllCollectingMethodValues } from '../../services/collectingMethodValues'
import { nowDb } from '../../utils/db'

jest.mock('../../utils/db', () => ({
  nowDb: {
    now_coll_meth_values: {
      findMany: jest.fn(),
    },
  },
  logDb: {},
}))

const mockedNowDb = jest.mocked(nowDb)

describe('getAllCollectingMethodValues', () => {
  it('queries collecting method values in ascending order', async () => {
    const rows = [{ coll_meth_value: 'A' }, { coll_meth_value: 'B' }]
    mockedNowDb.now_coll_meth_values.findMany.mockResolvedValueOnce(rows)

    const result = await getAllCollectingMethodValues()

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedNowDb.now_coll_meth_values.findMany).toHaveBeenCalledWith({
      orderBy: { coll_meth_value: 'asc' },
    })
    expect(result).toEqual(rows)
  })
})
