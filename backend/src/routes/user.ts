import { Router } from 'express'
// import { com_usersAttributes } from '../models/com_users'
import { models } from '../utils/db'

const router = Router()

// type UserForFrontend = Omit<com_usersAttributes, 'password'>

router.post('/login', async (req, res) => {
  const { username } = req.body
  console.log({ username })

  const result = await models.com_users.findOne({
    where: {
      user_name: username,
    },
    attributes: ['user_name'],
    raw: true,
  })
  console.log({ result })
  res.send(result)
})

export default router
