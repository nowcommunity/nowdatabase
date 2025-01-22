import { api } from './api'
import { Region, RegionDetails, EditDataType } from '@/shared/types'

const regionsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllRegions: builder.query<Region[], void>({
      query: () => ({
        url: `/region/all`,
      }),
      providesTags: result => (result ? [{ type: 'regions' }] : []),
    }),
    getRegionDetails: builder.query<RegionDetails, string>({
      query: id => ({
        url: `/region/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'region', id: result.reg_coord_id }] : []),
    }),
    editRegion: builder.mutation<RegionDetails, EditDataType<RegionDetails>>({
      query: region => ({
        url: `/region`,
        method: 'PUT',
        body: { region },
      }),
      invalidatesTags: (result, _error, { reg_coord_id }) =>
        result ? [{ type: 'region', id: reg_coord_id }, 'regions'] : [],
    }),
  }),
})

export const { useGetAllRegionsQuery, useGetRegionDetailsQuery, useEditRegionMutation } = regionsApi
