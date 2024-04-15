/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'

const localitiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllLocalities: builder.query<any, any>({
      query: () => ({
        url: `/locality/all`,
      }),
    }),
    getLocalityDetails: builder.query<Locality, any>({
      query: (id: number) => ({
        url: `/locality/${id}`,
      }),
    }),
  }),
})

export const { useGetAllLocalitiesQuery, useGetLocalityDetailsQuery } = localitiesApi

export type Locality = {
  lid: number
  bfa_max?: string
  bfa_min?: string
  loc_name: string
  date_meth: string
  max_age: number
  min_age: number
  bfa_max_abs?: string
  bfa_min_abs?: string
  frac_max?: string
  frac_min?: string
  chron?: string
  age_comm?: string
  basin?: string
  subbasin?: string
  dms_lat?: string
  dms_long?: string
  dec_lat: number
  dec_long: number
  approx_coord?: number
  altitude?: number
  country?: string
  state?: string
  county?: string
  site_area?: string
  gen_loc?: string
  plate?: string
  loc_detail?: string
  lgroup?: string
  formation?: string
  member?: string
  bed?: string
  datum_plane?: string
  tos?: number
  bos?: number
  rock_type?: string
  rt_adj?: string
  lith_comm?: string
  depo_context1?: string
  depo_context2?: string
  depo_context3?: string
  depo_context4?: string
  depo_comm?: string
  sed_env_1?: string
  sed_env_2?: string
  event_circum?: string
  se_comm?: string
  climate_type?: string
  biome?: string
  v_ht?: string
  v_struct?: string
  v_envi_det?: string
  disturb?: string
  nutrients?: string
  water?: string
  seasonality?: string
  seas_intens?: string
  pri_prod?: string
  moisture?: string
  temperature?: string
  assem_fm?: string
  transport?: string
  trans_mod?: string
  weath_trmp?: string
  pt_conc?: string
  size_type?: string
  vert_pres?: string
  plant_pres?: string
  invert_pres?: string
  time_rep?: string
  appr_num_spm?: number
  num_spm?: number
  true_quant?: string
  complete?: string
  num_quad?: number
  taph_comm?: string
  tax_comm?: string
  loc_status?: number
  estimate_precip?: number
  estimate_temp?: number
  estimate_npp?: number
  pers_woody_cover?: number
  pers_pollen_ap?: number
  pers_pollen_nap?: number
  pers_pollen_other?: number
  hominin_skeletal_remains: number
  bipedal_footprints: number
  stone_tool_technology: number
  stone_tool_cut_marks_on_bones: number
  technological_mode_1?: number
  technological_mode_2?: number
  technological_mode_3?: number
  cultural_stage_1?: string
  cultural_stage_2?: string
  cultural_stage_3?: string
  regional_culture_1?: string
  regional_culture_2?: string
  regional_culture_3?: string
}
