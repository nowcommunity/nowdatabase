import { prisma } from '../utils/db'
import * as bcrypt from 'bcrypt'

export const createTestUser = async () => {
  const passwordHash = await bcrypt.hash('test', 10)

  await prisma.com_users.create({
    data: {
      user_name: 'test',
      password: passwordHash,
    },
  })
}
