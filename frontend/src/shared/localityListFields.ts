// Locality list columns that are always returned (used by the map, KML export and row restriction checks).
export const LOCALITY_LIST_CORE_FIELDS = [
  'lid',
  'loc_name',
  'country',
  'loc_status',
  'dec_lat',
  'dec_long',
  'dms_lat',
  'dms_long',
  'max_age',
  'min_age',
  'bfa_max',
  'bfa_min',
] as const

// Locality list columns that are only returned when requested.
export const LOCALITY_LIST_OPTIONAL_FIELDS = [
  'bfa_max_abs',
  'bfa_min_abs',
  'frac_max',
  'frac_min',
  'chron',
  'age_comm',
  'basin',
  'subbasin',
  'altitude',
  'state',
  'county',
  'appr_num_spm',
  'site_area',
  'gen_loc',
  'plate',
  'formation',
  'member',
  'bed',
  'estimate_precip',
  'estimate_temp',
  'estimate_npp',
  'pers_woody_cover',
  'pers_pollen_ap',
  'pers_pollen_nap',
  'pers_pollen_other',
  'hominin_skeletal_remains',
  'bipedal_footprints',
  'stone_tool_cut_marks_on_bones',
  'stone_tool_technology',
  'technological_mode_1',
  'technological_mode_2',
  'technological_mode_3',
  'cultural_stage_1',
  'cultural_stage_2',
  'cultural_stage_3',
  'regional_culture_1',
  'regional_culture_2',
  'regional_culture_3',
] as const

export type LocalityListOptionalField = (typeof LOCALITY_LIST_OPTIONAL_FIELDS)[number]

const optionalFieldSet: ReadonlySet<string> = new Set(LOCALITY_LIST_OPTIONAL_FIELDS)

export const isLocalityListOptionalField = (field: string): field is LocalityListOptionalField =>
  optionalFieldSet.has(field)
