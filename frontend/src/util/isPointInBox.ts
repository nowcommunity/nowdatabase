import { CountryBoundingBox } from '@/country_data/countryBoundingBoxes'

// Checks whether or not given latitude longitude point is within a bounding box.
export const isPointInBoxes = (dec_lat: number, dec_long: number, boxes: CountryBoundingBox[]): boolean => {
  for (const box of boxes) {
    if (dec_lat < box.top) continue
    if (dec_lat > box.bottom) continue
    if (dec_long < box.left) continue
    if (dec_long > box.right) continue

    return true
  }

  return false
}

// Splits bounding box that wraps around the longitude
export const boundingBoxSplit = (box: CountryBoundingBox): CountryBoundingBox[] => {
  if (box.right >= box.left) return [box]
  return [
    {
      top: box.top,
      bottom: box.bottom,
      left: -180,
      right: box.right,
    },
    {
      top: box.top,
      bottom: box.bottom,
      left: box.left,
      right: 180,
    },
  ]
}
