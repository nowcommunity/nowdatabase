import { Role, User } from '../../../frontend/src/shared/types'
import { nowDb } from '../utils/db'

export const getAllProjects = async (user?: User) => {
  if (user?.role === Role.EditRestricted) {
    const projectLinks = await nowDb.now_proj_people.findMany({
      where: { initials: user.initials },
      select: { pid: true },
    })
    const projectIds = Array.from(new Set(projectLinks.map(link => link.pid)))
    if (projectIds.length === 0) return []
    return nowDb.now_proj.findMany({
      where: { pid: { in: projectIds } },
    })
  }

  const result = await nowDb.now_proj.findMany({})
  return result
}

export const getProjectDetails = async (id: number) => {
  // TODO: Check if user has access

  const result = await nowDb.now_proj.findUnique({
    where: { pid: id },
    include: {
      now_proj_people: {
        include: {
          com_people: true,
        },
      },
    },
  })
  return result
}

export const deleteProject = async (projectId: number) => {
  const project = await nowDb.now_proj.findUnique({
    where: { pid: projectId },
  })

  if (!project) return false

  await nowDb.$transaction(async prisma => {
    await prisma.now_proj_people.deleteMany({
      where: { pid: projectId },
    })

    await prisma.now_psr.deleteMany({
      where: { pid: projectId },
    })

    await prisma.now_plr.deleteMany({
      where: { pid: projectId },
    })

    await prisma.now_proj.delete({
      where: { pid: projectId },
    })
  })

  return true
}
