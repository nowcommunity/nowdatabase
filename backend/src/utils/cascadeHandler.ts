import { EditDataType, TimeUnitDetailsType, TimeBoundDetailsType } from '../../../frontend/src/backendTypes'
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

type Bounds = {
  bid: number
  age: number
}

type Unit = {
  up_bnd: number
  low_bnd: number
}


export const checkTimeBoundCascade = async (timeBound: EditDataType<TimeBoundDetailsType>) => {
  const timeUnits = await nowDb.now_time_unit.findMany({
    select: {
      up_bnd: true,
      low_bnd: true,
    },
    where: {
      OR: [{ up_bnd: timeBound.bid }, { low_bnd: timeBound.bid }],
    },
  })
  for (const timeUnit of timeUnits) {
    const bounds = await nowDb.now_tu_bound.findMany({
      select: {
        bid: true,
        age: true,
      },
      where: {
        OR: [{ bid: timeUnit.up_bnd }, { bid: timeUnit.low_bnd }],
      },
    })
    if (bounds.length === 2) {
      console.log(checkAges(timeUnit, bounds as Bounds[], timeBound.age as number, timeBound.bid as number))
    } else {
      console.log("Not enough bounds found for time unit. Bad")
    }
  }
  return { cascadeErrors: [], calculatorErrors: [], timeUnitsToUpdate: [] }
}

function checkAges(
  unit: Unit,
  list: Bounds[],
  editedAge: number,
  bid: number
): boolean | undefined {
  const upBoundEntry = list.find(item => item.bid === unit.up_bnd);
  const lowBoundEntry = list.find(item => item.bid === unit.low_bnd);
  if (upBoundEntry && lowBoundEntry) {
    const upBoundAge = unit.up_bnd === bid ? editedAge : upBoundEntry.age;
    const lowBoundAge = unit.low_bnd === bid ? editedAge : lowBoundEntry.age;
    return upBoundAge < lowBoundAge;
  } else {
    console.error("One or both bounds not found in the list.");
    return undefined;
  }
}