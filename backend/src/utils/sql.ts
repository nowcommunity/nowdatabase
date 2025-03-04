import { Prisma } from '../../prisma/generated/now_test_client'
import { getCrossSearchFields, getFieldsOfTables } from './db'

export const generateFilteredCrossSearchSql = (usersProjects: Set<number>) => {
  const projectsArray = Array.from(usersProjects)
  const projectsArrayString = projectsArray.join(', ')

  return Prisma.sql`
  SELECT
    now_loc.lid,
    loc_name,
    now_loc.bfa_max,
    bfa_min,
    max_age,
    min_age,
    bfa_max_abs,
    bfa_min_abs,
    frac_max,
    frac_min,
    chron,
    basin,
    subbasin,
    dms_lat,
    dms_long,
    dec_lat,
    dec_long,
    altitude,
    country,
    state,
    county,
    site_area,
    gen_loc,
    plate,
    formation,
    member,
    bed,
    species_id,
    subclass_or_superorder_name,
    order_name,
    suborder_or_superfamily_name,
    family_name,
    subfamily_name,
    genus_name,
    species_name,
    unique_identifier,
    taxonomic_status,
    common_name,
    sp_author,
    strain,
    gene,
    sp_comment,
    com_species.body_mass,
    brain_mass,
    now_loc.loc_status
  FROM 
    now_ls
  LEFT JOIN
    (SELECT
      now_loc.lid,
      loc_name,
      now_loc.bfa_max,
      bfa_min,
      max_age,
      min_age,
      bfa_max_abs,
      bfa_min_abs,
      frac_max,
      frac_min,
      chron,
      basin,
      subbasin,
      dms_lat,
      dms_long,
      dec_lat,
      dec_long,
      altitude,
      country,
      state,
      county,
      site_area,
      gen_loc,
      plate,
      formation,
      member,
      bed,
      loc_status
    FROM
      now_loc
    LEFT JOIN
      now_plr
    ON
      now_loc.lid = now_plr.lid
    WHERE
      loc_status = 0
    OR
      now_plr.pid IN (${projectsArrayString})
    GROUP BY
      now_loc.lid
    ) as now_loc
  ON
    now_loc.lid = now_ls.lid
  LEFT JOIN
    com_species
  ON
    species_id = now_ls.species_id
  WHERE
    now_loc.lid IS NOT NULL
  ORDER BY
    now_loc.lid
  LIMIT 4
  `
}

export type ColumnFilter = { id: string; value: string }

const convertFilterIdToFieldName = (id: string) => {
  const aliasToFieldName: { [key: string]: string } = {
    species_id_com_species: 'com_species.species_id',
    body_mass_com_species: 'com_species.body_mass',
    microwear_com_species: 'com_species.microwear',
    mesowear_com_species: 'com_species.mesowear',
    mw_or_high_com_species: 'com_species.mw_or_high',
    mw_or_low_com_species: 'com_species.mw_or_low',
    mw_cs_sharp_com_species: 'com_species.mw_cs_sharp',
    mw_cs_round_com_species: 'com_species.mw_cs_round',
    mw_cs_blunt_com_species: 'com_species.mw_cs_blunt',
    mw_scale_min_com_species: 'com_species.mw_scale_min',
    mw_scale_max_com_species: 'com_species.mw_scale_max',
    mw_value_com_species: 'com_species.mw_value',

    lid_now_loc: 'now_loc.lid',
    species_id_now_ls: 'now_ls.species_id',
    microwear_now_ls: 'now_ls.microwear',
    body_mass_now_ls: 'now_ls.body_mass',
    mesowear_now_ls: 'now_ls.mesowear',
    mw_or_high_now_ls: 'now_ls.mw_or_high',
    mw_or_low_now_ls: 'now_ls.mw_or_low',
    mw_cs_sharp_now_ls: 'now_ls.mw_cs_sharp',
    mw_cs_round_now_ls: 'now_ls.mw_cs_round',
    mw_cs_blunt_now_ls: 'now_ls.mw_cs_blunt',
    mw_scale_min_now_ls: 'now_ls.mw_scale_min',
    mw_scale_max_now_ls: 'now_ls.mw_scale_max',
    mw_value_now_ls: 'now_ls.mw_value',
  }

  if (Object.keys(aliasToFieldName).includes(id)) {
    return aliasToFieldName[id]
  }

  if (getFieldsOfTables(['com_species']).includes(id)) {
    return `com_species.${id}`
  }
  if (getFieldsOfTables(['now_ls']).includes(id)) {
    return `now_ls.${id}`
  }
  if (getFieldsOfTables(['now_loc']).includes(id)) {
    return `now_loc.${id}`
  }
  return id
}

const generateColumnFilterQuery = (columnFilters: ColumnFilter[] | undefined) => {
  if (!Array.isArray(columnFilters) || columnFilters.length === 0) return Prisma.empty
  const conditions: Prisma.Sql[] = []

  const allowedColumns = getCrossSearchFields()

  for (const filter of columnFilters) {
    const convertedId = convertFilterIdToFieldName(filter.id)
    if (!allowedColumns.includes(convertedId)) throw new Error('INVALID COLUMN NAME!')
    const newQuery = Prisma.sql`${Prisma.raw(convertedId)} = ${filter.value}` // possible SQL injection!!!!!
    conditions.push(newQuery)
  }

  if (!conditions.length) throw new Error('NO CONDITIONS! this should never happen')
  const joinedConditions = Prisma.sql`AND ${Prisma.join(conditions, ' AND ')}`
  return joinedConditions
}

export const generateFilteredCrossSearchSqlWithNoUser = (
  limit: number | undefined,
  offset: number | undefined,
  columnFilters: ColumnFilter[] | undefined
) => {
  const columnFilterQuery = generateColumnFilterQuery(columnFilters)
  return Prisma.sql`
  SELECT 
      -- com_species fields
      com_species.species_id AS species_id_com_species,
      com_species.class_name,
      com_species.order_name,
      com_species.family_name,
      com_species.subclass_or_superorder_name,
      com_species.suborder_or_superfamily_name,
      com_species.subfamily_name,
      com_species.genus_name,
      com_species.species_name,
      com_species.unique_identifier,
      com_species.taxonomic_status,
      com_species.common_name,
      com_species.sp_author,
      com_species.strain,
      com_species.gene,
      com_species.taxon_status,
      com_species.diet1,
      com_species.diet2,
      com_species.diet3,
      com_species.diet_description,
      com_species.rel_fib,
      com_species.selectivity,
      com_species.digestion,
      com_species.feedinghab1,
      com_species.feedinghab2,
      com_species.shelterhab1,
      com_species.shelterhab2,
      com_species.locomo1,
      com_species.locomo2,
      com_species.locomo3,
      com_species.hunt_forage,
      com_species.body_mass AS body_mass_com_species,
      com_species.brain_mass,
      com_species.sv_length,
      com_species.activity,
      com_species.sd_size,
      com_species.sd_display,
      com_species.tshm,
      com_species.symph_mob,
      com_species.relative_blade_length,
      com_species.tht,
      com_species.crowntype,
      com_species.microwear AS microwear_com_species,
      com_species.horizodonty,
      com_species.cusp_shape,
      com_species.cusp_count_buccal,
      com_species.cusp_count_lingual,
      com_species.loph_count_lon,
      com_species.loph_count_trs,
      com_species.fct_al,
      com_species.fct_ol,
      com_species.fct_sf,
      com_species.fct_ot,
      com_species.fct_cm,
      com_species.mesowear AS mesowear_com_species,
      com_species.mw_or_high AS mw_or_high_com_species,
      com_species.mw_or_low AS mw_or_low_com_species,
      com_species.mw_cs_sharp AS mw_cs_sharp_com_species,
      com_species.mw_cs_round AS mw_cs_round_com_species,
      com_species.mw_cs_blunt AS mw_cs_blunt_com_species,
      com_species.mw_scale_min AS mw_scale_min_com_species,
      com_species.mw_scale_max AS mw_scale_max_com_species,
      com_species.mw_value AS mw_value_com_species,
      com_species.pop_struc,
      com_species.sp_status,
      com_species.used_morph,
      com_species.used_now,
      com_species.used_gene,
      com_species.sp_comment,

      -- now_ls fields
      now_ls.lid,
      now_ls.species_id AS species_id_now_ls,
      now_ls.nis,
      now_ls.pct,
      now_ls.quad,
      now_ls.mni,
      now_ls.qua,
      now_ls.id_status,
      now_ls.orig_entry,
      now_ls.source_name,
      now_ls.body_mass AS body_mass_now_ls,
      now_ls.mesowear AS mesowear_now_ls,
      now_ls.mw_or_high AS mw_or_high_now_ls,
      now_ls.mw_or_low AS mw_or_low_now_ls,
      now_ls.mw_cs_sharp AS mw_cs_sharp_now_ls,
      now_ls.mw_cs_round AS mw_cs_round_now_ls,
      now_ls.mw_cs_blunt AS mw_cs_blunt_now_ls,
      now_ls.mw_scale_min AS mw_scale_min_now_ls,
      now_ls.mw_scale_max AS mw_scale_max_now_ls,
      now_ls.mw_value AS mw_value_now_ls,
      now_ls.microwear AS microwear_now_ls,
      now_ls.dc13_mean,
      now_ls.dc13_n,
      now_ls.dc13_max,
      now_ls.dc13_min,
      now_ls.dc13_stdev,
      now_ls.do18_mean,
      now_ls.do18_n,
      now_ls.do18_max,
      now_ls.do18_min,
      now_ls.do18_stdev,

      -- now_loc fields
      now_loc.lid AS lid_now_loc,
      now_loc.bfa_max,
      now_loc.bfa_min,
      now_loc.loc_name,
      now_loc.date_meth,
      now_loc.max_age,
      now_loc.min_age,
      now_loc.bfa_max_abs,
      now_loc.bfa_min_abs,
      now_loc.frac_max,
      now_loc.frac_min,
      now_loc.chron,
      now_loc.age_comm,
      now_loc.basin,
      now_loc.subbasin,
      now_loc.dms_lat,
      now_loc.dms_long,
      now_loc.dec_lat,
      now_loc.dec_long,
      now_loc.approx_coord,
      now_loc.altitude,
      now_loc.country,
      now_loc.state,
      now_loc.county,
      now_loc.site_area,
      now_loc.gen_loc,
      now_loc.plate,
      now_loc.loc_detail,
      now_loc.lgroup,
      now_loc.formation,
      now_loc.member,
      now_loc.bed,
      now_loc.datum_plane,
      now_loc.tos,
      now_loc.bos,
      now_loc.rock_type,
      now_loc.rt_adj,
      now_loc.lith_comm,
      now_loc.depo_context1,
      now_loc.depo_context2,
      now_loc.depo_context3,
      now_loc.depo_context4,
      now_loc.depo_comm,
      now_loc.sed_env_1,
      now_loc.sed_env_2,
      now_loc.event_circum,
      now_loc.se_comm,
      now_loc.climate_type,
      now_loc.biome,
      now_loc.v_ht,
      now_loc.v_struct,
      now_loc.v_envi_det,
      now_loc.disturb,
      now_loc.nutrients,
      now_loc.water,
      now_loc.seasonality,
      now_loc.seas_intens,
      now_loc.pri_prod,
      now_loc.moisture,
      now_loc.temperature,
      now_loc.assem_fm,
      now_loc.transport,
      now_loc.trans_mod,
      now_loc.weath_trmp,
      now_loc.pt_conc,
      now_loc.size_type,
      now_loc.vert_pres,
      now_loc.plant_pres,
      now_loc.invert_pres,
      now_loc.time_rep,
      now_loc.appr_num_spm,
      now_loc.num_spm,
      now_loc.true_quant,
      now_loc.complete,
      now_loc.num_quad,
      now_loc.taph_comm,
      now_loc.tax_comm,
      now_loc.loc_status,
      now_loc.estimate_precip,
      now_loc.estimate_temp,
      now_loc.estimate_npp,
      now_loc.pers_woody_cover,
      now_loc.pers_pollen_ap,
      now_loc.pers_pollen_nap,
      now_loc.pers_pollen_other,
      now_loc.hominin_skeletal_remains,
      now_loc.bipedal_footprints,
      now_loc.stone_tool_technology,
      now_loc.stone_tool_cut_marks_on_bones,
      now_loc.technological_mode_1,
      now_loc.technological_mode_2,
      now_loc.technological_mode_3,
      now_loc.cultural_stage_1,
      now_loc.cultural_stage_2,
      now_loc.cultural_stage_3,
      now_loc.regional_culture_1,
      now_loc.regional_culture_2,
      now_loc.regional_culture_3,
  COUNT(*) OVER() AS full_count
  FROM com_species
  INNER JOIN now_ls ON com_species.species_id = now_ls.species_id
  INNER JOIN now_loc ON now_ls.lid = now_loc.lid
  WHERE now_loc.loc_status = 0 ${columnFilterQuery}
  ORDER BY
    now_loc.lid
  ${limit ? Prisma.sql`LIMIT ${limit}` : Prisma.empty}
  ${offset ? Prisma.sql`OFFSET ${offset}` : Prisma.empty}
  `
}

export const originalGenerateFilteredCrossSearchSqlWithAdmin = (limit: number, offset: number) => {
  return Prisma.sql`
  SELECT 
    now_loc.lid,
    loc_name,
    bfa_max,
    bfa_min,
    max_age,
    min_age,
    bfa_max_abs,
    bfa_min_abs,
    frac_max,
    frac_min,
    chron,
    basin,
    subbasin,
    dms_lat,
    dms_long,
    dec_lat,
    dec_long,
    altitude,
    country,
    state,
    county,
    site_area,
    gen_loc,
    plate,
    formation,
    member,
    bed,
    species_id,
    subclass_or_superorder_name,
    order_name,
    suborder_or_superfamily_name,
    family_name,
    subfamily_name,
    genus_name,
    species_name,
    unique_identifier,
    taxonomic_status,
    common_name,
    sp_author,
    strain,
    gene,
    com_species.body_mass,
    brain_mass,
    loc_status
  FROM
    now_ls
  LEFT JOIN
    now_loc
  ON
    now_ls.lid = now_loc.lid
  LEFT JOIN
    com_species
  ON
    now_ls.species_id = species_id
  ORDER BY
    now_loc.lid
  LIMIT 2
  OFFSET
    ${offset}
  `
  //     ${limit}
}

export const generateFilteredCrossSearchSqlWithAdmin = () => {
  return Prisma.sql`
  SELECT 
    now_loc.lid,
    loc_name,
    bfa_max,
    bfa_min,
    max_age,
    min_age,
    bfa_max_abs,
    bfa_min_abs,
    frac_max,
    frac_min,
    chron,
    basin,
    subbasin,
    dms_lat,
    dms_long,
    dec_lat,
    dec_long,
    altitude,
    country,
    state,
    county,
    site_area,
    gen_loc,
    plate,
    formation,
    member,
    bed,
    species_id,
    subclass_or_superorder_name,
    order_name,
    suborder_or_superfamily_name,
    family_name,
    subfamily_name,
    genus_name,
    species_name,
    unique_identifier,
    taxonomic_status,
    common_name,
    sp_author,
    strain,
    gene,
    com_species.body_mass,
    brain_mass
  FROM
    now_ls
  LEFT JOIN
    now_loc
  ON
    now_ls.lid = now_loc.lid
  LEFT JOIN
    com_species
  ON
    now_ls.species_id = species_id
  ORDER BY
    now_loc.lid
  LIMIT 3
    `
}
