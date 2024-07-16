/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router } from 'express'
import * as jwt from 'jsonwebtoken'
import { SECRET, LOGIN_VALID_MS, USER_CREATION_SECRET } from '../utils/config'
import * as bcrypt from 'bcrypt'
import { nowDb } from '../utils/db'
import { getRole } from '../middlewares/authenticator'
import { AccessError } from '../middlewares/authorizer'

const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const foundUser = await nowDb.com_users.findFirst({
    where: {
      user_name: username,
    },
    select: { user_name: true, newpassword: true, user_id: true, now_user_group: true },
  })

  const passwordMatches = foundUser && (await bcrypt.compare(password as string, foundUser.newpassword as string))

  if (!passwordMatches) return res.status(403).send()

  const token = jwt.sign({ username: foundUser.user_name, id: foundUser.user_id }, SECRET, {
    expiresIn: LOGIN_VALID_MS,
  })

  const personResult = await nowDb.com_people.findFirst({
    where: { user_id: foundUser.user_id },
    select: {
      initials: true,
      now_proj: { select: { now_plr: { select: { now_loc: { select: { lid: true } } } } } },
    },
  })

  if (!personResult) throw new Error('User found but not person; this should not happen.')

  const associatedLocalityIds = personResult.now_proj.flatMap(proj => proj.now_plr.map(plr => plr.now_loc.lid))

  await nowDb.com_users.update({ where: { user_id: foundUser.user_id }, data: { last_login: new Date() } })

  return res.status(200).send({
    token,
    username: foundUser.user_name,
    role: getRole(foundUser.now_user_group ?? ''),
    initials: personResult.initials,
    localities: associatedLocalityIds,
  })
})

const createPasswordHash = async (password: string) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

router.post('/create', async (req, res) => {
  // TODO type guards
  const { username, password, secret } = req.body
  if (!secret || secret !== USER_CREATION_SECRET) throw Error('Wrong user creation secret')
  const passwordHash = await createPasswordHash(password as string)
  await nowDb.com_users.create({
    data: {
      user_name: username as string,
      newpassword: passwordHash,
    },
  })

  return res.status(200).send()
})

router.put('/password', async (req, res) => {
  if (!req.user) throw new AccessError()
  const { userId } = req.user
  const { newPassword, oldPassword } = req.body as { newPassword: string; oldPassword: string }

  const foundUser = await nowDb.com_users.findFirst({
    where: {
      user_id: userId,
    },
    select: { newpassword: true },
  })

  // Confusing naming here, but newpassword in db refers to the password hash used by this application.
  const passwordMatches = foundUser && (await bcrypt.compare(oldPassword, foundUser.newpassword as string))
  if (!passwordMatches) return res.status(403).send()
  if (newPassword.length < 8) return res.status(400).send('Password must be at least 8 characters long.')
  if (!/^[0-9A-Za-z$%&~]+/.test(newPassword))
    return res.status(400).send('Use only alphanumeric characters a-z, A-Z and 0-9 and symbols ^?$%&~ in the password')

  const passwordHash = await createPasswordHash(newPassword)
  await nowDb.com_users.update({ where: { user_id: userId }, data: { newpassword: passwordHash } })
  return res.status(200).send()
})

export default router
