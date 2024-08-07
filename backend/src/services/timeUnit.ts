import { logDb, nowDb } from '../utils/db'

export const getAllTimeUnits = async () => {
  const result = await nowDb.now_time_unit.findMany({
    select: {
      tu_name: true,
      tu_display_name: true,
      rank: true,
      now_tu_sequence: {
        select: {
          seq_name: true,
        },
      },
      now_tu_bound_now_time_unit_low_bndTonow_tu_bound: {
        select: {
          age: true,
        },
      },
      now_tu_bound_now_time_unit_up_bndTonow_tu_bound: {
        select: {
          age: true,
        },
      },
    },
  })

  return result.map(item => ({
    tu_name: item.tu_name,
    tu_display_name: item.tu_display_name,
    rank: item.rank,
    low_bound: item.now_tu_bound_now_time_unit_low_bndTonow_tu_bound.age,
    up_bound: item.now_tu_bound_now_time_unit_up_bndTonow_tu_bound.age,
    seq_name: item.now_tu_sequence.seq_name,
  }))
}

export const getTimeUnitDetails = async (id: string) => {
  // TODO: Check if user has access
  const result = await nowDb.now_time_unit.findUnique({
    where: { tu_name: id },
    include: {
      now_tu_sequence: {},
      now_tu_bound_now_time_unit_low_bndTonow_tu_bound: {},
      now_tu_bound_now_time_unit_up_bndTonow_tu_bound: {},
      now_tau: {
        include: {
          now_tr: {
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

  const tuids = result.now_tau.map(tau => tau.tuid)

  const logResult = await logDb.log.findMany({ where: { suid: { in: tuids } } })

  result.now_tau = result.now_tau.map(tau => ({
    ...tau,
    updates: logResult.filter(logRow => logRow.tuid === tau.tuid),
  }))

  return result
}

export const getTimeUnitLocalities = async (id: string) => {
  // TODO: Check if user has access
  const result = await nowDb.now_loc.findMany({
    where: { OR: [{ bfa_max: id }, { bfa_min: id }] },
  })
  return result
}
