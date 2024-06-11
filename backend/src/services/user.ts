import { nowDb } from '../utils/db'
import * as bcrypt from 'bcrypt'
import { logger } from '../utils/logger'
import { sleep } from '../utils/common'

export const createTestUser = async () => {
  for (let i = 0; i < 10; i++) {
    try {
      const passwordHash = await bcrypt.hash('test', 10)
      await nowDb.com_users.create({
        data: {
          user_name: 'test',
          password: passwordHash,
        },
      })
      logger.info('Test user created.')
      return
    } catch {
      logger.error(`Test user creation failed, attempt ${i} / 10. Trying again in 6 seconds.`)
      await sleep(6000)
    }
  }
}

export const getAllUsers = async () => {
  const result = await nowDb.com_users.findMany({})
  return result
}
