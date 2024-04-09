import { Router } from 'express'
import { models } from '../utils/db'
import jwt from 'jsonwebtoken'
import { SECRET } from '../utils/config'

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

  const passwordMatches = result && result.password === password // (await bcrypt.compare(password, result.password as string))

  if (!passwordMatches) return res.status(403).send()

  const token = jwt.sign({ username: result.user_name, id: result.user_id }, SECRET)

  return res.status(200).send({ token, username: result.user_name })
})

// TODO: make this hash the password, for now it's only for testing.
router.post('/create', async (req, res) => {
  const { username, password } = req.body
  await models.com_users.create({
    user_name: username,
    password,
  })

  return res.status(200).send()
})

export default router
