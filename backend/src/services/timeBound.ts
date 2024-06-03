import { prisma } from '../utils/db'

export const getAllTimeBounds = async () => {
  const result = await prisma.now_tu_bound.findMany({
    select: {
      bid: true,
      b_name: true,
      age: true,
      b_comment: true,
    },
  })
  return result
}

export const getTimeBoundDetails = async (id: number) => {
  // TODO: Check if user has access
  const result = await prisma.now_tu_bound.findUnique({ where: { bid: id } })
  return result
}
