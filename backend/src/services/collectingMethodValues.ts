import { nowDb } from '../utils/db'

export const getAllCollectingMethodValues = async () => {
  return nowDb.now_coll_meth_values.findMany({
    orderBy: { coll_meth_value: 'asc' },
  })
}
