import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import app from '../../app'
import { nowDb, pool } from '../../utils/db'
import { resetDatabaseTimeout } from '../utils'

const resetAndSeedTestUsers = async () => {
  await request(app).get('/test/reset-test-database').expect(200)
  await request(app).get('/test/create-test-users').expect(200)
}

const loginAndGetToken = async (username: string) => {
  const result = await request(app)
    .post('/user/login')
    .send({ username, password: 'test' })
    .set('Content-Type', 'application/json')
    .expect(200)
  const { token } = result.body as { token: string }
  return token
}

describe('Reference locality access checks', () => {
  beforeAll(async () => {
    await resetAndSeedTestUsers()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await resetAndSeedTestUsers()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it(
    'filters restricted localities based on user visibility',
    async () => {
      const refType = await nowDb.ref_ref_type.findFirst({ select: { ref_type_id: true } })
      expect(refType).not.toBeNull()

      const reference = await nowDb.ref_ref.create({
        data: {
          ref_type_id: refType!.ref_type_id,
          title_primary: 'Reference access test',
        },
        select: { rid: true },
      })

      const createUpdateLink = async (lid: number) => {
        const update = await nowDb.now_lau.create({
          data: {
            lid,
            lau_coordinator: 'TEST-SU',
            lau_authorizer: 'TEST-SU',
            lau_date: new Date(),
          },
          select: { luid: true },
        })

        await nowDb.now_lr.create({
          data: { luid: update.luid, rid: reference.rid },
        })
      }

      // Both of these are created by /test/create-test-users with `loc_status: true`.
      // - `50001` is linked to a project where TEST-PL is a member.
      // - `49999` has no project link, so only Admin / EditUnrestricted can view it.
      await createUpdateLink(49999)
      await createUpdateLink(50001)

      const unauthenticated = await request(app).get(`/reference/localities/${reference.rid}`).expect(200)
      expect(unauthenticated.body).toEqual([])

      const plToken = await loginAndGetToken('testPl')
      const plResponse = await request(app)
        .get(`/reference/localities/${reference.rid}`)
        .set('authorization', `bearer ${plToken}`)
        .expect(200)

      const plLids = (plResponse.body as Array<{ lid?: number }>).map(row => row.lid)
      expect(plLids).toContain(50001)
      expect(plLids).not.toContain(49999)

      const suToken = await loginAndGetToken('testSu')
      const suResponse = await request(app)
        .get(`/reference/localities/${reference.rid}`)
        .set('authorization', `bearer ${suToken}`)
        .expect(200)

      const suLids = (suResponse.body as Array<{ lid?: number }>).map(row => row.lid)
      expect(suLids).toEqual(expect.arrayContaining([49999, 50001]))
    },
    resetDatabaseTimeout
  )
})
