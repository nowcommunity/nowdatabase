import { EditDataType, TimeUnitDetailsType } from '../../../frontend/src/backendTypes'
import { nowDb } from './db'
import { calculateLocalityMaxAge, calculateLocalityMinAge } from './ageCalculator'

export const checkTimeUnitCascade = async (timeUnit: EditDataType<TimeUnitDetailsType>) => {
  const localities = await nowDb.now_loc.findMany({
    where: {
      OR: [{ bfa_max: timeUnit.tu_name }, { bfa_min: timeUnit.tu_name }],
    },
  })
  const cascadeErrors: string[] = []
  const calculatorErrors: string[] = []
  const localitiesToUpdate = []
  for (const locality of localities) {
    let maxAgeAfterUpdate = locality.max_age
    let minAgeAfterUpdate = locality.min_age
    if (locality.bfa_max === timeUnit.tu_name) {
      try {
        maxAgeAfterUpdate = calculateLocalityMaxAge(
          timeUnit.up_bound?.age as number,
          timeUnit.low_bound?.age as number,
          locality.frac_max
        )
      } catch (e) {
        calculatorErrors.push(locality.loc_name)
      }
    }
    if (locality.bfa_min === timeUnit.tu_name) {
      try {
        minAgeAfterUpdate = calculateLocalityMinAge(
          timeUnit.up_bound?.age as number,
          timeUnit.low_bound?.age as number,
          locality.frac_max
        )
      } catch (e) {
        calculatorErrors.push(locality.loc_name)
      }
    }
    if (minAgeAfterUpdate < maxAgeAfterUpdate) {
      const updatedLocality = {
        ...locality,
        min_age: minAgeAfterUpdate,
        max_age: maxAgeAfterUpdate,
      }
      localitiesToUpdate.push(updatedLocality)
    } else {
      cascadeErrors.push(locality.loc_name)
    }
  }
  return { cascadeErrors, calculatorErrors, localitiesToUpdate }
}