import { Prisma } from '../../prisma/generated/now_test_client'

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
    com_species.species_id
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
    com_species.species_id = now_ls.species_id
  WHERE
    now_loc.lid IS NOT NULL
  ORDER BY
    now_loc.lid
  `
}

export const generateFilteredCrossSearchSqlWithNoUser = () => {
  return Prisma.sql`
  SELECT 
    now_loc.lid,
    loc_name,
    dms_lat,
    dms_long,
    dec_lat,
    dec_long,
    altitude,
    max_age,
    bfa_max,
    bfa_max_abs,
    frac_max,
    min_age,
    bfa_min,
    bfa_min_abs,
    frac_min,
    chron,
    age_comm,
    basin,
    subbasin,
    country,
    state,
    county,
    appr_num_spm,
    gen_loc,
    estimate_precip,
    estimate_temp,
    estimate_npp,
    pers_woody_cover,
    pers_pollen_ap,
    pers_pollen_nap,
    pers_pollen_other,
    hominin_skeletal_remains,
    bipedal_footprints,
    stone_tool_cut_marks_on_bones,
    stone_tool_technology,
    technological_mode_1,
    technological_mode_2,
    technological_mode_3,
    cultural_stage_1,
    cultural_stage_2,
    cultural_stage_3,
    regional_culture_1,
    regional_culture_2,
    regional_culture_3,
    com_species.species_id
    order_name,
    family_name,
    genus_name,
    species_name,
    subclass_or_superorder_name,
    suborder_or_superfamily_name,
    subfamily_name,
    unique_identifier,
    taxonomic_status,
    com_species.sv_length,
    com_species.body_mass,
    sd_size,
    sd_display,
    tshm,
    tht,
    horizodonty,
    crowntype,
    cusp_shape,
    cusp_count_buccal,
    cusp_count_lingual,
    loph_count_lon,
    loph_count_trs,
    fct_al,
    fct_ol,
    fct_sf,
    fct_ot,
    fct_cm,
    com_species.microwear,
    com_species.mesowear,
    com_species.mw_or_high,
    com_species.mw_or_low,
    com_species.mw_cs_sharp,
    com_species.mw_cs_round,
    com_species.mw_cs_blunt,
    diet1,
    diet2,
    diet3,
    locomo1,
    locomo2,
    locomo3,
    sp_comment,
    id_status,
    orig_entry,
    source_name,
  FROM
    now_ls
  LEFT JOIN
    now_loc
  ON
    now_ls.lid = now_loc.lid
  LEFT JOIN
    com_species
  ON
    now_ls.species_id = com_species.species_id
  WHERE
    now_loc.loc_status = 0
  ORDER BY
    now_loc.lid
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
    com_species.species_id
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
    now_ls.species_id = com_species.species_id
  ORDER BY
    now_loc.lid
  LIMIT
    ${limit}
  OFFSET
    ${offset}
  `
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
    com_species.species_id
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
    now_ls.species_id = com_species.species_id
  ORDER BY
    now_loc.lid
    `
}
