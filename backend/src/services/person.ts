import { where } from 'sequelize'
import { prisma } from '../utils/db'

export const getAllPersons = async () => {
  const result = await prisma.com_people.findMany({})
  return result
}

export const getPersonDetails = async (id: string) => {
  // TODO: Check if user has access

  const result = await prisma.com_people.findUnique({
    where: { initials: id },
  })
  return result
}
