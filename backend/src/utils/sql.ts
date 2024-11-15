import { Prisma } from '../../prisma/generated/now_test_client'

export const generateFilteredCrossSearchSql = (limit: number) => {
  return Prisma.sql`
  SELECT 
    now_plr.pid,
    now_loc.lid,
    loc_name, 
    country,
    com_species.species_id
  FROM 
   now_loc
  LEFT JOIN
    now_plr
  ON
    now_loc.lid = now_plr.lid  
  WHERE
    ISNULL(now_loc.pid)
  LEFT JOIN
   now_ls 
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
  `
}

export const oldGenerateFilteredCrossSearchSql = (limit: number) => {
  return Prisma.sql`
  SELECT 
    now_plr.pid,
    now_loc.lid,
    loc_name, 
    country,
    com_species.species_id
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
  LEFT JOIN
    now_plr
  ON
    now_loc.lid = now_plr.lid  
  ORDER BY
    now_loc.lid
  LIMIT
   ${limit}
  `
}
