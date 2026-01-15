import { CollectingMethod, Editable } from '../../../../frontend/src/shared/types'
import { ValidationObject } from '../../../../frontend/src/shared/validators/validator'
import { nowDb } from '../db'

const isActiveCollectingMethod = (method: Editable<CollectingMethod>) =>
  !('rowState' in method) || method.rowState !== 'removed'

export const validateCollectingMethodValues = async (
  collectingMethods: Array<Editable<CollectingMethod>> | undefined
): Promise<ValidationObject | null> => {
  if (!collectingMethods || collectingMethods.length === 0) return null

  const activeMethods = collectingMethods.filter(isActiveCollectingMethod)
  if (activeMethods.length === 0) return null

  const validValues = await nowDb.now_coll_meth_values.findMany({
    select: { coll_meth_value: true },
  })
  const validSet = new Set(validValues.map(value => value.coll_meth_value))

  const invalidValues = Array.from(
    new Set(activeMethods.map(method => method.coll_meth).filter(method => !validSet.has(method)))
  )

  if (invalidValues.length === 0) return null

  return {
    name: 'now_coll_meth',
    error: `Collecting method value(s) not recognized: ${invalidValues.join(', ')}`,
  }
}
