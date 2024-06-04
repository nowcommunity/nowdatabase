import { logger } from '../utils/logger'
import { prisma } from '../utils/db'
import { EditDataType, TimeBoundDetailsType } from '../../../frontend/src/backendTypes'
import Prisma from '@prisma/client'
import { validateTimeBound } from '../../../frontend/src/validators/timeBound'

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

  const result = await prisma.now_tu_bound.findUnique({
    where: { bid: id },
    include: {
      now_bau: {
        include: {
          now_br: true,
        },
      },
    },
  })
  return result
}

export const getTimeBoundTimeUnits = async (id: number) => {
  // TODO: Check if user has access
  const result = await prisma.now_time_unit.findMany({
    where: { OR: [{ up_bnd: id }, { low_bnd: id }] },
  })
  return result
}
