import { User, CrossSearch } from '../../../frontend/src/shared/types'
import { Role } from '../../../frontend/src/shared/types'
import { nowDb } from '../utils/db'
import {
  generateFilteredCrossSearchSql,
  generateFilteredCrossSearchSqlWithAdmin,
  generateFilteredCrossSearchSqlWithNoUser,
} from '../utils/sql'

const getIdsOfUsersProjects = async (user: User) => {
  const usersProjects = await nowDb.now_proj_people.findMany({
    where: { initials: user.initials },
    select: { pid: true },
  })

  return new Set(usersProjects.map(({ pid }) => pid))
}

export const getCrossSearchRawSql = async (user: User | undefined) => {
  const showAll = user && [Role.Admin, Role.EditUnrestricted].includes(user.role)
  if (!user) {
    const sql = generateFilteredCrossSearchSqlWithNoUser()
    const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
    return result
  }

  if (showAll) {
    const sql = generateFilteredCrossSearchSqlWithAdmin()
    const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
    return result
  }

  const usersProjects = await getIdsOfUsersProjects(user)

  if (!usersProjects.size) {
    const sql = generateFilteredCrossSearchSqlWithNoUser()
    const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
    return result
  }

  const sql = generateFilteredCrossSearchSql(usersProjects)
  const result: Partial<CrossSearch>[] = await nowDb.$queryRaw(sql)
  return result
}
