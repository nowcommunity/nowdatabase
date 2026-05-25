import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { pool, nowDb } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'

const createPerson = async (initials: string, userId?: number) => {
  await nowDb.com_people.create({
    data: {
      initials,
      first_name: 'Delete',
      surname: 'Candidate',
      full_name: 'Delete Candidate',
      email: `${initials.toLowerCase()}@example.com`,
      organization: 'Test organization',
      country: 'Finland',
      user_id: userId,
    },
  })
}

describe('Deleting person works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('deletes a person without user relation or protected activity', async () => {
    await createPerson('DEL-NO')

    const deleteResult = await send('person/DEL-NO', 'DELETE')
    expect(deleteResult.status).toEqual(200)

    const deletedPerson = await nowDb.com_people.findUnique({ where: { initials: 'DEL-NO' } })
    expect(deletedPerson).toBeNull()
  })

  it('deletes a person and their user when the user has no protected activity', async () => {
    const user = await nowDb.com_users.create({
      data: {
        user_name: 'delete-person-user',
        now_user_group: 'eu',
      },
    })
    await createPerson('DEL-USR', user.user_id)

    const deleteResult = await send('person/DEL-USR', 'DELETE')
    expect(deleteResult.status).toEqual(200)

    const deletedPerson = await nowDb.com_people.findUnique({ where: { initials: 'DEL-USR' } })
    const deletedUser = await nowDb.com_users.findUnique({ where: { user_id: user.user_id } })
    expect(deletedPerson).toBeNull()
    expect(deletedUser).toBeNull()
  })

  it('does not delete a person with update history or project and coordinator links', async () => {
    const deleteResult = await send<{ blockers: string[]; message: string }>('person/AD', 'DELETE')

    expect(deleteResult.status).toEqual(409)
    expect(deleteResult.body.message).toEqual(
      'Person cannot be deleted because they are linked to: person has data update history; person is assigned to projects or coordinator groups.'
    )
    expect(deleteResult.body.blockers).toEqual([
      'person has data update history',
      'person is assigned to projects or coordinator groups',
    ])

    const person = await nowDb.com_people.findUnique({ where: { initials: 'AD' } })
    expect(person).not.toBeNull()
  })

  it('does not allow users to delete their own person record', async () => {
    const deleteResult = await send<{ blockers: string[]; message: string }>('person/TEST-SU', 'DELETE')

    expect(deleteResult.status).toEqual(409)
    expect(deleteResult.body.message).toEqual('You cannot delete your own person record.')
    expect(deleteResult.body.blockers).toEqual(['self'])
  })

  it('deleting fails without admin permissions', async () => {
    await createPerson('DEL-PERM')

    logout()
    const deleteResultNoPerm = await send('person/DEL-PERM', 'DELETE')
    expect(deleteResultNoPerm.status).toEqual(403)

    await login('testEr')
    const deleteResultEr = await send('person/DEL-PERM', 'DELETE')
    expect(deleteResultEr.status).toEqual(403)
    expect(deleteResultEr.body).toEqual(noPermError)

    const person = await nowDb.com_people.findUnique({ where: { initials: 'DEL-PERM' } })
    expect(person).not.toBeNull()
  })
})
