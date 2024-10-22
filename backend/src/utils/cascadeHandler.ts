import { EditDataType, TimeUnitDetailsType } from '../../../frontend/src/backendTypes'
import { WriteHandler } from '../services/write/writeOperations/writeHandler'
import { nowDb } from './db'
import { calculateLocalityMax, calculateLocalityMin } from './ageCalculator'

export const checkAndHandleTimeUnitCascade = async (
  timeUnit: EditDataType<TimeUnitDetailsType>,
  writeHandler: WriteHandler
) => {
  const cascadeErrors: string[] = []
  console.log('Checking and handling time unit cascade')
  console.log('Time unit:', timeUnit)
  const localities = await nowDb.now_loc.findMany({
    where: {
      OR: [{ bfa_max: timeUnit.tu_name },
      { bfa_min: timeUnit.tu_name },
      ]
    }
  })
  for (const locality of localities) {
    console.log('Locality:', locality.loc_name)
    if (locality.bfa_max === timeUnit.tu_name && locality.bfa_min === timeUnit.tu_name) {
      console.log('Update both')
      const new_max = calculateLocalityMax(locality, timeUnit)
      const new_min = calculateLocalityMin(locality, timeUnit)
      if (new_max && new_min) {
        await nowDb.now_loc.update({
          where: { lid: locality.lid },
          data: {
            max_age: new_max,
            min_age: new_min
          }
        })
      }
    } else if (locality.bfa_max === timeUnit.tu_name) {
      const new_max = calculateLocalityMax(locality, timeUnit)
      if (new_max && new_max > locality.min_age) {
        console.log('Update max')
        await nowDb.now_loc.update({
          where: { lid: locality.lid },
          data: {
            max_age: new_max
          }
        })
      } else {
        cascadeErrors.push(locality.loc_name)
      }
    } else if (locality.bfa_min === timeUnit.tu_name) {
      const new_min = calculateLocalityMin(locality, timeUnit)
      if (new_min && new_min < locality.max_age) {
        console.log('Update min')
        await nowDb.now_loc.update({
          where: { lid: locality.lid },
          data: {
            min_age: new_min
          }
        })
      } else {
        cascadeErrors.push(locality.loc_name)
      }
    } else {
      console.log('No update')
    }
  }
  return cascadeErrors
}