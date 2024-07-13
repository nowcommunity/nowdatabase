import { nowDb } from '../utils/db'
import * as bcrypt from 'bcrypt'
import { logger } from '../utils/logger'
import { sleep } from '../utils/common'

export const createDraftLocality = async () => {
  const draftLocality = await nowDb.now_loc.findUnique({ where: { lid: 49999 } })
  if (draftLocality) return
  await nowDb.now_loc.create({
    data: { lid: 49999, min_age: 2, max_age: 3, loc_status: true, loc_name: 'draftLocality' },
  })
  await nowDb.now_loc.create({
    data: {
      lid: 50001,
      min_age: 2,
      max_age: 3,
      loc_status: true,
      loc_name: 'draftLocalityWithProject',
      now_plr: {
        create: {
          now_proj: {
            create: {
              contact: 'TEST-PL',
              proj_name: 'Test Project',
              now_proj_people: { create: { initials: 'TEST-PL' } },
            },
          },
        },
      },
    },
  })
}

export const createTestUsers = async () => {
  const testUsers = [
    {
      user_name: 'testSu',
      now_user_group: 'su',
    },
    {
      user_name: 'testEu',
      now_user_group: 'eu',
    },
    {
      user_name: 'testEr',
      now_user_group: 'er',
    },
    {
      user_name: 'testNo',
      now_user_group: 'no',
    },
    {
      user_name: 'testPl',
      now_user_group: 'pl',
    },
  ]
  for (let i = 0; i < 10; i++) {
    try {
      const passwordHash = await bcrypt.hash('test', 10)
      for (const testUser of testUsers) {
        const existingUser = await nowDb.com_users.findFirst({
          where: { ...testUser },
        })
        let userId
        if (!existingUser) {
          const createdUser = await nowDb.com_users.create({
            data: {
              user_name: testUser.user_name,
              newpassword: passwordHash,
              now_user_group: testUser.now_user_group,
            },
          })
          userId = createdUser.user_id
        } else {
          userId = existingUser.user_id
        }
        const initials = `TEST-${testUser.now_user_group.toUpperCase()}`
        const existingPerson = await nowDb.com_people.findFirst({
          where: { initials },
        })
        if (existingPerson) {
          logger.info(`User ${testUser.user_name} already exists, continuing`)
          continue
        }
        await nowDb.com_people.create({
          data: {
            user_id: userId,
            initials,
          },
        })
        logger.info(`User ${testUser.user_name} created`)
      }
      await createDraftLocality()
      return
    } catch (e: unknown) {
      logger.error(`Test user creation failed, attempt ${i} / 10. Trying again in 6 seconds.`)
      if (e instanceof Error) logger.error(JSON.stringify(e.stack, null, 2))
      await sleep(6000)
    }
  }
}
