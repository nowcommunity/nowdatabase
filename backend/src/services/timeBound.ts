import { logDb, nowDb } from '../utils/db'

export const getAllTimeBounds = async () => {
  const result = await nowDb.now_tu_bound.findMany({
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

  const result = await nowDb.now_tu_bound.findUnique({
    where: { bid: id },
    include: {
      now_bau: {
        include: {
          now_br: {
            include: {
              ref_ref: {
                include: {
                  ref_authors: true,
                  ref_journal: true,
                },
              },
            },
          },
        },
      },
    },
  })
  if (!result) return null

  const buids = result.now_bau.map(bau => bau.buid)

  const logResult = await logDb.log.findMany({ where: { buid: { in: buids } } })

  result.now_bau = result.now_bau.map(bau => ({
    ...bau,
    updates: logResult.filter(logRow => logRow.buid === bau.buid),
  }))

  return result
}

export const getTimeBoundTimeUnits = async (id: number) => {
  // TODO: Check if user has access
  const result = await nowDb.now_time_unit.findMany({
    where: { OR: [{ up_bnd: id }, { low_bnd: id }] },
  })
  return result
}
