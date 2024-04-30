import { models, sequelize } from '../utils/db';

export const getAllReferences = async () => {
  try {
    const result = await models.ref_ref.findAll({
    attributes: [
      ['rid', 'Reference Id'],
      [sequelize.col('ref_authors.author_surname'), 'Author'],
      [sequelize.col('journal.journal_title'), 'Journal'],
      ['date_primary', 'Year'],
      ['title_primary', 'Title'],
      ['title_secondary', 'Book Title'],
      [sequelize.col('ref_type.ref_type'), 'Type']
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
    logging: console.log  // This will log the SQL query to the console
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
