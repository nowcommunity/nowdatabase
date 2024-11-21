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
