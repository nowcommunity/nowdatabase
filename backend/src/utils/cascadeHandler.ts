import { EditDataType, TimeUnitDetailsType, Reference } from '../../../frontend/src/backendTypes'
import { WriteHandler } from '../services/write/writeOperations/writeHandler'
import { nowDb } from './db'
import { calculateLocalityMaxAge, calculateLocalityMinAge } from './ageCalculator'
import { getFieldsOfTables } from './db'
import { NOW_DB_NAME } from './config'

export const checkAndHandleTimeUnitCascade = async (
  timeUnit: EditDataType<TimeUnitDetailsType>,
  loggerInfo: { authorizer: string, comment: string | undefined, references: Reference[] | undefined }
) => {
  const cascadeErrors: string[] = []
  const localities = await nowDb.now_loc.findMany({
    where: {
      OR: [{ bfa_max: timeUnit.tu_name },
      { bfa_min: timeUnit.tu_name },
      ]
    }
  })
  const localitiesToUpdate = []
  for (const locality of localities) {
    if (locality.bfa_max === timeUnit.tu_name && locality.bfa_min === timeUnit.tu_name) {
      const new_max = calculateLocalityMaxAge(timeUnit.up_bound?.age as number, timeUnit.low_bound?.age as number, locality.frac_max)
      const new_min = calculateLocalityMinAge(timeUnit.up_bound?.age as number, timeUnit.low_bound?.age as number, locality.frac_min)
      if (new_max && new_min && new_max > new_min) {
        const updatedLocality = {
          ...locality,
          max_age: new_max,
          min_age: new_min,
        }
        localitiesToUpdate.push(updatedLocality)
      } else {
        cascadeErrors.push(locality.loc_name)
      }
    } else if (locality.bfa_max === timeUnit.tu_name) {
      const new_max = calculateLocalityMaxAge(timeUnit.up_bound?.age as number, timeUnit.low_bound?.age as number, locality.frac_max)
      if (new_max && new_max > locality.min_age) {
        const updatedLocality = {
          ...locality,
          max_age: new_max,
        }
        localitiesToUpdate.push(updatedLocality)
      } else {
        cascadeErrors.push(locality.loc_name)
      }
    } else if (locality.bfa_min === timeUnit.tu_name) {
      const new_min = calculateLocalityMinAge(timeUnit.up_bound?.age as number, timeUnit.low_bound?.age as number, locality.frac_max)
      if (new_min && new_min < locality.max_age) {
        const updatedLocality = {
          ...locality,
          min_age: new_min,
        }
        localitiesToUpdate.push(updatedLocality)
      } else {
        cascadeErrors.push(locality.loc_name)
      }
    } else {
      console.log('No update')
    }
  }
  if (!cascadeErrors.length) {
    for (const locality of localitiesToUpdate) {
      console.log('Updating locality:', locality.loc_name)
    }
  }
  return {cascadeErrors, localitiesToUpdate}
}