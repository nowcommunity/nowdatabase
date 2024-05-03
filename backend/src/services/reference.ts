import { models, sequelize } from '../utils/db'

export const getAllReferences = async () => {
  const result = await models.ref_ref.findAll({
    attributes: [
      'rid',
      'date_primary',
      'title_primary',
      'title_secondary',
      [sequelize.col('journal.journal_title'), 'journal_title'],
    ],
    include: [
      {
        model: models.ref_authors,
        as: 'ref_authors',
        attributes: ['au_num', 'author_surname', 'author_initials'],
      },
      {
        model: models.ref_journal,
        as: 'journal',
        attributes: [],
      },
      {
        model: models.ref_ref_type,
        as: 'ref_type',
        attributes: ['ref_type'],
      },
    ],
  })
  return result
}

export const getReferenceDetails = async (id: number) => {
  // TODO: Check if user has access
  const result = await models.ref_ref.findByPk(id)
  return result
}
