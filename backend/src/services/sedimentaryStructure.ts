import { prisma } from '../utils/db'

export const getAllSedimentaryStructures = async () => {
  const result = await prisma.now_ss_values.findMany({})
  return result
}
