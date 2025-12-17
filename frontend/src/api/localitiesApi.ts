import type { EditDataType, LocalityDetailsType } from '@/shared/types'
import type { LocalityFormValues } from '@/components/Locality/LocalityForm'

const toCoordinateString = (value: number | null | undefined) => (typeof value === 'number' ? value.toString() : '')

export const localityDetailsToFormValues = (locality: LocalityDetailsType): LocalityFormValues => ({
  localityName: locality.loc_name ?? '',
  country: locality.country ?? '',
  latitude: toCoordinateString(locality.dec_lat),
  longitude: toCoordinateString(locality.dec_long),
  visibility: locality.loc_status ? 'private' : 'public',
})

export const localityFormValuesToPayload = (
  values: LocalityFormValues,
  base: EditDataType<LocalityDetailsType>
): EditDataType<LocalityDetailsType> => ({
  ...base,
  loc_name: values.localityName.trim(),
  country: values.country.trim(),
  dec_lat: values.latitude === '' ? undefined : Number(values.latitude),
  dec_long: values.longitude === '' ? undefined : Number(values.longitude),
  loc_status: values.visibility === 'private',
})
