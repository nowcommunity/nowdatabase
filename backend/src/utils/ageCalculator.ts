import { EditDataType, TimeUnitDetailsType } from "../../../frontend/src/backendTypes"
import Prisma from '../../prisma/generated/now_test_client'

export const calculateLocalityMax = (locality: Prisma.now_loc, timeUnit: EditDataType<TimeUnitDetailsType>) => {
  if (locality.frac_max) {
    console.log('Fractional max')
  } else {
    return timeUnit.low_bound?.age
  console.log('Calculating new max')
  console.log('Locality:')
  console.log('max:', locality.max_age)
  console.log('max frac:', locality.frac_max)
  console.log('min:', locality.min_age)
  console.log('min frac:', locality.frac_min)
}
}

export const calculateLocalityMin = (locality: Prisma.now_loc, timeUnit: EditDataType<TimeUnitDetailsType>) => {
  if (locality.frac_min) {
    console.log('Fractional min')
  } else {
    return timeUnit.up_bound?.age
  }
}