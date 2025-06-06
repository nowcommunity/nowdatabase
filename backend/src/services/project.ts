import { nowDb } from '../utils/db'

export const getAllProjects = async () => {
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
