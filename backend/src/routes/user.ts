/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Router } from 'express'
import { sign } from 'jsonwebtoken'
import { SECRET, LOGIN_VALID_SECONDS } from '../utils/config'
import * as bcrypt from 'bcrypt'
import { nowDb } from '../utils/db'
import { getRole } from '../middlewares/authenticator'
import { AccessError } from '../middlewares/authorizer'
import { Role } from '../../../frontend/src/types'
import md5 from 'md5'

const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (typeof username !== 'string' || typeof password !== 'string' || username === '' || password === '')
    throw new AccessError()
  const foundUser = await nowDb.com_users.findFirst({
    where: {
      user_name: username,
    },
    select: { user_name: true, password: true, newpassword: true, user_id: true, now_user_group: true },
  })

  let isFirstLogin: true | undefined

  // For first login, we'll allow logging in with the old password using md5, but prompt user to change their password.
  if (foundUser?.newpassword === null) {
    const oldHash = md5(password)
    if (foundUser.password !== oldHash) throw new AccessError()
    isFirstLogin = true
  } else {
    const passwordMatches = foundUser && (await bcrypt.compare(password, foundUser.newpassword))
    if (!passwordMatches) throw new AccessError()
  }

  const token = sign({ username: foundUser.user_name, id: foundUser.user_id }, SECRET, {
    expiresIn: LOGIN_VALID_SECONDS,
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
    isFirstLogin,
  })
})

const createPasswordHash = async (password: string) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

router.post('/create', async (req, res) => {
  const { username, password, secret } = req.body

  if ((!req.user || req.user?.role !== Role.Admin) && secret !== SECRET) throw new AccessError()

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
    select: { password: true, newpassword: true },
  })

  let passwordMatches: boolean
  if (foundUser?.newpassword === null) {
    // Compare old password
    const hash = md5(oldPassword)
    passwordMatches = hash === foundUser.password
  } else {
    passwordMatches = !!foundUser && !!(await bcrypt.compare(oldPassword, foundUser.newpassword))
  }

  if (!passwordMatches) return res.status(403).send()

  if (newPassword.length < 8) return res.status(400).send({ message: 'Password must be at least 8 characters long.' })

  if (!/^[0-9A-Za-z$%&~]+/.test(newPassword))
    return res
      .status(400)
      .send({ message: 'Use only alphanumeric characters a-z, A-Z and 0-9 and symbols ^?$%&~ in the password' })

  const passwordHash = await createPasswordHash(newPassword)

  await nowDb.com_users.update({ where: { user_id: userId }, data: { newpassword: passwordHash } })
  return res.status(200).send()
})

router.post('/create')

export default router
