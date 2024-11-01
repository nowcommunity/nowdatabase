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
  tu_name: string
  up_bnd: number
  low_bnd: number
}

type EditedUnit = {
  timeUnit: Unit
  editedBounds: { upBoundAge: number; lowBoundAge: number }
}

type Locality = {
  loc_name: string
  max_age: number
  min_age: number
  bfa_max: string
  bfa_min: string
  frac_max: string
}

export const checkTimeBoundCascade = async (timeBound: EditDataType<TimeBoundDetailsType>) => {
  const cascadeErrors: string[] = []
  const calculatorErrors: string[] = []
  const localitiesToCheck: Locality[] = []
  const timeUnitsToUpdate = []

  const timeUnits = await nowDb.now_time_unit.findMany({
    select: {
      tu_name: true,
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

    const editedBounds = calculateTimeUnitAges(
      timeUnit,
      bounds as Bounds[],
      timeBound.age as number,
      timeBound.bid as number
    )

    if (editedBounds) {
      if (editedBounds.lowBoundAge > editedBounds.upBoundAge) {
        timeUnitsToUpdate.push({ timeUnit, editedBounds })
      } else {
        cascadeErrors.push(timeUnit.tu_name)
      }
    } else {
      calculatorErrors.push(timeUnit.tu_name)
    }
  }
  for (const timeUnit of timeUnitsToUpdate) {
    const localities = (await nowDb.now_loc.findMany({
      select: {
        loc_name: true,
        max_age: true,
        min_age: true,
        bfa_max: true,
        bfa_min: true,
        frac_max: true,
      },
      where: {
        OR: [{ bfa_max: timeUnit.timeUnit.tu_name }, { bfa_min: timeUnit.timeUnit.tu_name }],
      },
    })) as Locality[]

    localitiesToCheck.push(...localities)
  }

  const { cascadeErrorsLocalities, calculatorErrorsLocalities, localitiesToUpdate } = handleLocalityAndTimeUnitLists(
    localitiesToCheck,
    timeUnitsToUpdate
  )
  cascadeErrors.push(...cascadeErrorsLocalities)
  calculatorErrors.push(...calculatorErrorsLocalities)
  return { cascadeErrors, calculatorErrors, localitiesToUpdate, timeUnitsToUpdate }
}

const calculateTimeUnitAges = (unit: Unit, list: Bounds[], editedAge: number, bid: number) => {
  const upBoundEntry = list.find(item => item.bid === unit.up_bnd)
  const lowBoundEntry = list.find(item => item.bid === unit.low_bnd)
  if (upBoundEntry && lowBoundEntry) {
    const upBoundAge = unit.up_bnd === bid ? editedAge : upBoundEntry.age
    const lowBoundAge = unit.low_bnd === bid ? editedAge : lowBoundEntry.age
    return { upBoundAge, lowBoundAge }
  } else {
    return undefined
  }
}

const handleLocalityAndTimeUnitLists = (localities: Locality[], timeUnits: EditedUnit[]) => {
  const cascadeErrorsLocalities: string[] = []
  const calculatorErrorsLocalities: string[] = []
  const localitiesToUpdate: Locality[] = []
  const timeUnitNames = timeUnits.map(unit => unit.timeUnit.tu_name)

  for (const locality of localities) {
    let maxAgeAfterUpdate = locality.max_age
    let minAgeAfterUpdate = locality.min_age

    if (timeUnitNames.includes(locality.bfa_max)) {
      const timeUnit = timeUnits.find(unit => unit.timeUnit.tu_name === locality.bfa_max)
      try {
        maxAgeAfterUpdate = calculateLocalityMaxAge(
          timeUnit?.editedBounds.upBoundAge as number,
          timeUnit?.editedBounds.lowBoundAge as number,
          locality.frac_max
        )
      } catch (e) {
        calculatorErrorsLocalities.push(locality.loc_name)
      }
    }
    if (timeUnitNames.includes(locality.bfa_min)) {
      const timeUnit = timeUnits.find(unit => unit.timeUnit.tu_name === locality.bfa_min)
      try {
        minAgeAfterUpdate = calculateLocalityMinAge(
          timeUnit?.editedBounds.upBoundAge as number,
          timeUnit?.editedBounds.lowBoundAge as number,
          locality.frac_max
        )
      } catch (e) {
        calculatorErrorsLocalities.push(locality.loc_name)
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
      cascadeErrorsLocalities.push(locality.loc_name)
    }
  }
  return { cascadeErrorsLocalities, calculatorErrorsLocalities, localitiesToUpdate }
}
