import * as bcrypt from 'bcrypt'

export const createPasswordHash = async (password: string) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}
