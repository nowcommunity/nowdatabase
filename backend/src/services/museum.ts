import { prisma } from '../utils/db'

export const getAllMuseums = async () => {
  const result = await prisma.com_mlist.findMany({})
  return result
}
