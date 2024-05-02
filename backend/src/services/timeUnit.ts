import { models, sequelize } from '../utils/db'

export const getAllTimeUnits = async () => {
  const result = await models.now_time_unit.findAll({
    attributes: [
      'tu_name',
      'tu_display_name',
      [sequelize.col('low_bnd_now_tu_bound.age'), 'low_bound'],
      [sequelize.col('up_bnd_now_tu_bound.age'), 'up_bound'],
      [sequelize.col('sequence_now_tu_sequence.seq_name'), 'seq_name'],
      'rank',
    ],
    include: [
      {
        model: models.now_tu_sequence,
        as: 'sequence_now_tu_sequence',
        attributes: [],
      },
      {
        model: models.now_tu_bound,
        as: 'up_bnd_now_tu_bound',
        attributes: [],
      },
      {
        model: models.now_tu_bound,
        as: 'low_bnd_now_tu_bound',
        attributes: [],
      },
    ],
  })
  return result
}

export const getTimeUnitDetails = async (id: string) => {
  // TODO: Check if user has access
  const result = await models.now_time_unit.findByPk(id)
  return result
}
