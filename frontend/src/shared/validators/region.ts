import { EditDataType, RegionCoordinator, RegionCountry, RegionDetails } from '../types'
import { Validators, validator, ValidationError } from './validator'

const countryCheck = (countries: EditDataType<RegionCountry[]>) => {
  for (const country of countries) {
    if (!('country' in country) || typeof country.country !== 'string' || country.country === '') {
      return 'Invalid or missing country field in region countries'
    }
  }
  const uniqueCountries = new Set(countries.map(country => country.country!))
  if (uniqueCountries.size !== countries.length) return 'Duplicate country in country list'
  return null as ValidationError
}

// TODO: check if a person exists in the database that matches the initials? this situation currently returns error 500
const coordinatorCheck = (coordinators: EditDataType<RegionCoordinator[]>) => {
  for (const coordinator of coordinators) {
    if (!('initials' in coordinator) || typeof coordinator.initials !== 'string') {
      return 'Invalid or missing coordinator initials in region coordinators'
    }
  }
  return null as ValidationError
}
export const validateRegion = (editData: EditDataType<RegionDetails>, fieldName: keyof EditDataType<RegionDetails>) => {
  const validators: Validators<Partial<EditDataType<RegionDetails>>> = {
    reg_coord_id: {
      name: 'reg_coord_id',
      required: true,
    },
    region: {
      name: 'Region',
      required: true,
      asString: value => {
        if (value.trim().length === 0) return 'Region name must not be empty'
        return null
      },
    },
    now_reg_coord_country: {
      name: 'Countries',
      miscArray: countryCheck,
    },
    now_reg_coord_people: {
      name: 'Region Coordinators',
      miscArray: coordinatorCheck,
    },
  }

  return validator<EditDataType<RegionDetails>>(validators, editData, fieldName)
}
