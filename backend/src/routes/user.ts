/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router } from 'express'
import * as jwt from 'jsonwebtoken'
import { SECRET, LOGIN_VALID_MS, USER_CREATION_SECRET } from '../utils/config'
import * as bcrypt from 'bcrypt'
import { nowDb } from '../utils/db'
import { getRole } from '../middlewares/authenticator'

const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const foundUser = await nowDb.com_users.findFirst({
    where: {
      user_name: username,
    },
    select: { user_name: true, newpassword: true, user_id: true, now_user_group: true },
  })
  console.log({ foundUser })
  const passwordMatches = foundUser && (await bcrypt.compare(password as string, foundUser.newpassword as string))

  if (!passwordMatches) return res.status(403).send()

  const token = jwt.sign({ username: foundUser.user_name, id: foundUser.user_id }, SECRET, {
    expiresIn: LOGIN_VALID_MS,
  })

  const personResult = await nowDb.com_people.findFirst({ where: { user_id: foundUser.user_id } })

  if (!personResult) throw new Error('User found but not person; this should not happen.')

  await nowDb.com_users.update({ where: { user_id: foundUser.user_id }, data: { last_login: new Date() } })

  return res.status(200).send({
    token,
    username: foundUser.user_name,
    role: getRole(foundUser.now_user_group ?? ''),
    initials: personResult.initials,
  })
})

router.post('/create', async (req, res) => {
  // TODO type guards
  const { username, password, secret } = req.body
  if (!secret || secret !== USER_CREATION_SECRET) throw Error('Wrong user creation secret')
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password as string, saltRounds)

  await nowDb.com_users.create({
    data: {
      user_name: username as string,
      newpassword: passwordHash,
    },
  })

  return res.status(200).send()
})

export default router
