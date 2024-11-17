import { ColumnFilterUrl } from '../../../frontend/src/backendTypes'
import { constructFilterSql } from './url'
import { Prisma } from '../../prisma/generated/now_test_client'

export const generateFilteredCrossSearchSql = (limit: number, offset: number, usersProjects: Set<number>) => {
  const projectsArray = Array.from(usersProjects)
  const projectsArrayString = projectsArray.join(', ')

  return Prisma.sql`
  SELECT 
    now_loc.lid,
    loc_name, 
    country,
    com_species.species_id,
    now_loc.loc_status
  FROM 
    now_ls
  LEFT JOIN
    (SELECT
      now_loc.lid,  loc_name, country, loc_status
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
  LIMIT
    ${limit}
  OFFSET
    ${offset}
  `
}

export const generateFilteredCrossSearchSqlWithNoUser = (limit: number, offset: number) => {
  return Prisma.sql`
  SELECT 
    now_loc.lid,
    loc_name,
    country,
    com_species.species_id,
    com_species.species_name,
    com_species.genus_name
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
  LIMIT
    ${limit}
  OFFSET
    ${offset}
  `
}

export const generateFilteredCrossSearchSqlWithAdminTest = (
  filter: ColumnFilterUrl[],
  limit: number,
  offset: number
) => {
  const sql = Prisma.sql`
  SELECT 
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
  WHERE
    ${constructFilterSql(filter)}
  ORDER BY
    now_loc.lid
  LIMIT
    ${limit}
  OFFSET
    ${offset}
  ;`
  console.log('final sql:', sql)
  return sql
}

export const originalGenerateFilteredCrossSearchSqlWithAdmin = (limit: number, offset: number) => {
  return Prisma.sql`
  SELECT 
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
  ORDER BY
    now_loc.lid
  LIMIT
    ${limit}
  OFFSET
    ${offset}
  `
}

export const generateFilteredCrossSearchSqlWithAdmin = (filters: ColumnFilterUrl[], limit: number, offset: number) => {
  let sql = Prisma.sql`
  SELECT 
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
    now_ls.species_id = com_species.species_id`

  if (filters.length !== 0) sql = Prisma.sql`${sql}\n  WHERE`
  let i = 0
  filters.forEach(filter => {
    if (i === 0) sql = Prisma.sql`${sql} ${filter.id} LIKE '${filter.value}%'`
    else sql = Prisma.sql`${sql} AND ${filter.id} LIKE '${filter.value}%'`
    i++
  })
  console.log('final sql in generator:', sql)
  return sql
}
