/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Router } from 'express'
import { sign } from 'jsonwebtoken'
import { SECRET, LOGIN_VALID_SECONDS } from '../utils/config'
import * as bcrypt from 'bcrypt'
import { nowDb } from '../utils/db'
import { getRole } from '../middlewares/authenticator'
import { AccessError } from '../middlewares/authorizer'
import { EditDataType, Role, UserDetailsType } from '../../../frontend/src/shared/types'
import md5 from 'md5'
import { validatePassword } from '../utils/validatePassword'
import { validateUser } from '../services/user'

const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (typeof username !== 'string' || typeof password !== 'string' || username === '' || password === '')
    throw new AccessError()
  const foundUser = await nowDb.com_users.findFirst({
    where: {
      user_name: username,
    },
    select: {
      user_name: true,
      password: true,
      newpassword: true,
      user_id: true,
      now_user_group: true,
      last_login: true,
    },
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

  // if this is the user's first time logging in, prompt user to change their password.
  if (!foundUser.last_login) {
    isFirstLogin = true
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
  const { username, password, initials, role, secret } = req.body

  if ((!req.user || req.user?.role !== Role.Admin) && secret !== SECRET) throw new AccessError()

  const passwordHash = await createPasswordHash(password as string)

  const createdUser = await nowDb.com_users.create({
    data: {
      user_name: username as string,
      newpassword: passwordHash,
      now_user_group: role,
    },
  })

  await nowDb.com_people.create({
    data: {
      initials,
      user_id: createdUser.user_id,
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

  if (!passwordMatches) return res.status(403).send({ error: 'Old password does not match your current password.' })

  const validationResult = validatePassword(newPassword)
  if (!validationResult.isValid) return res.status(400).send({ error: validationResult.error })

  const passwordHash = await createPasswordHash(newPassword)

  await nowDb.com_users.update({ where: { user_id: userId }, data: { newpassword: passwordHash } })
  return res.status(200).send()
})

router.post('/create', async (req: Request<object, object, { user: UserDetailsType }>, res) => {
  const { ...user } = req.body.user

  if (!user.initials) {
    return res.status(403).send({ error: 'Missing initials' })
  }

  if (!req.user || req.user.role !== Role.Admin)
    return res.status(401).send({
      message: 'User not authorized for the requested resource or action',
    })

  const error = await validateUser(user)
  if (error)
    return res.status(400).send({
      message: error,
    })

  //  TODO: All good, write user.
  return res.status(200).send({ content: 'nothing' })
})

export default router
