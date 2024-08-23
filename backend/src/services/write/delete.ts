import { pool } from '../../utils/db'
import { DatabaseHandler } from '../writeOperations/databaseHandler'

export const deleteLocality = async (id: string | number) => {
  const dbHandler = new DatabaseHandler(await pool.getConnection())
  await dbHandler.start()
  const deletedLocalitySpecies = await dbHandler.delete('now_ls', [{ column: 'lid', value: id }], [])
  const deletedLocality = await dbHandler.delete('now_loc', [{ column: 'lid', value: id }])

  // eslint-disable-next-line no-console
  console.log({ deletedLocalitySpecies, deletedLocality })

  // TODO: Log deletion
  // TODO: clarify: Do we need to log all relations, for example now_coll_meth if lid is removed?
  await dbHandler.end()
}
