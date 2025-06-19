import { CountryBoundingBox } from '@/country_data/countryBoundingBoxes'

// Checks whether or not given latitude longitude point is within a bounding box.
export const isPointInBox = (dec_lat: number, dec_long: number, box: CountryBoundingBox): boolean => {
  if (dec_lat < box.top) return false
  if (dec_lat > box.bottom) return false
  if (dec_long < box.left) return false
  if (dec_long > box.right) return false

  return true
}
