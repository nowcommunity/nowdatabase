import { CountryBoundingBox } from '@/country_data/countryBoundingBoxes'

// Checks whether or not given latitude longitude point is within a bounding box.
export const isPointInBox = (dec_lat: number, dec_long: number, box: CountryBoundingBox): boolean => {
  if (dec_lat < box.left) return false
  if (dec_lat > box.right) return false
  if (dec_long < box.top) return false
  if (dec_long > box.bottom) return false

  return true
}
