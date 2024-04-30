import { models, sequelize } from '../utils/db';

export const getAllReferences = async () => {
  try {
    const result = await models.ref_ref.findAll({
    attributes: [
      ['rid', 'rid'],
      [sequelize.col('ref_authors.author_surname'), 'first_author'],
      [sequelize.col('journal.journal_title'), 'journal_title'],
      ['date_primary', 'date_primary'],
      ['title_primary', 'title_primary'],
      ['title_secondary', 'title_secondary'],
      [sequelize.col('ref_type.ref_type'), 'ref_type']
    ],
    include: [
      {
        model: models.ref_authors,
        as: 'ref_authors',
        attributes: [],
        where: { au_num: 1 }  // field to determine the first author
      },
      {
        model: models.ref_journal,
        as: 'journal',
        attributes: []
      },
      {
        model: models.ref_ref_type,
        as: 'ref_type',
        attributes: []
      }
    ],
    group: ['ref_ref.rid'],  // This groups the results to ensure each reference ID only appears once
    raw: true,  // This makes sure that the data returned is only raw data objects
  });
    return result;
  } catch (error) {
    console.error('Error fetching references:', error);
    throw error;
  }
}

export const getReferenceDetails = async (id: number) => {
  // TODO: Check if user has access
  const result = await models.ref_ref.findByPk(id)
  return result
}
