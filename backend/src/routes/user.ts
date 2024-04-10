import { Router } from 'express'
import { models } from '../utils/db'
import jwt from 'jsonwebtoken'
import { SECRET } from '../utils/config'
import bcrypt from 'bcrypt'

const router = Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const result = await models.com_users.findOne({
    where: {
      user_name: username,
    },
    attributes: ['user_name', 'password', 'user_id'],
    raw: true,
  })

  const passwordMatches = result && (await bcrypt.compare(password, result.password as string))

  if (!passwordMatches) return res.status(403).send()

  const token = jwt.sign({ username: result.user_name, id: result.user_id }, SECRET)

  return res.status(200).send({ token, username: result.user_name })
})

router.post('/create', async (req, res) => {
  const { username, password } = req.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  await models.com_users.create({
    user_name: username,
    password: passwordHash,
  })

  return res.status(200).send()
})

export default router
