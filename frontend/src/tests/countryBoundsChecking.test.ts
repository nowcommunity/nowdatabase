import { fail } from 'assert'
import { countryBoundingBoxes } from '../country_data/countryBoundingBoxes'
import { validCountries } from '../shared/validators/countryList'
import { it, describe } from '@jest/globals'

describe('Country bounding box coordinate checking', () => {
  it('All countries are present', () => {
    //  NOTE: Possible political connotations are purely coincidental.
    //  The ignored countries and territories simply represent names not
    //  present in the U.N. data used for country boundaries.
    const ignore = [
      'Aland Islands',
      'Antarctica',
      'Ascension Island',
      'Ashmore and Cartier Islands',
      'Baker Island',
      'Bassas Da India',
      'Bonaire',
      'Clipperton Island',
      'Coral Sea Islands',
      'Curacao',
      'Europa Island',
      'Falkland Islands (Islas Malvinas)',
      'Heard Island and Mcdonald Islands',
      'Howland Island',
      'Isle Of Man',
      'Jan Mayen',
      'Juan De Nova Island',
      'Kosovo',
      'Macau',
      'Midway Islands',
      "No Man's Land",
      'Pitcairn Islands',
      'Saba',
      'Saint Barthelemy',
      'Saint Eustatius',
      'Saint Helena',
      'Saint Martin',
      'Saint Pierre and Miquelon',
      'Svalbard',
      'Tromelin Island',
      'United States Minor Outlying Islands',
      'Vatican City',
      'Wake Island',
      'Wallis and Futuna',
      'Palestine',
    ]

    for (const country of validCountries) {
      if (ignore.includes(country)) continue
      if (!(country in countryBoundingBoxes)) {
        fail(`${country} not in bounding box data.`)
      }
    }
  })
})
