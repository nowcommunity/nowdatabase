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
  ] as const

  const passwordHash = await bcrypt.hash('test', 10)
  for (let i = 0; i < 10; i++) {
    try {
      for (const testUser of testUsers) {
        const initials = `TEST-${testUser.now_user_group.toUpperCase()}`

        const user = await nowDb.com_users.upsert({
          where: { user_name: testUser.user_name },
          create: {
            user_name: testUser.user_name,
            newpassword: passwordHash,
            now_user_group: testUser.now_user_group,
          },
          update: {
            now_user_group: testUser.now_user_group,
            newpassword: passwordHash,
          },
          select: { user_id: true },
        })

        await nowDb.com_people.upsert({
          where: { initials },
          create: {
            user_id: user.user_id,
            initials,
          },
          update: {
            user_id: user.user_id,
          },
        })

        logger.info(`User ${testUser.user_name} ensured for tests`)
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
