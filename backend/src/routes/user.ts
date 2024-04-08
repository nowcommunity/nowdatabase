import { Router } from 'express'
// import { com_usersAttributes } from '../models/com_users'
import { models } from '../utils/db'

const router = Router()

// type UserForFrontend = Omit<com_usersAttributes, 'password'>

router.post('/login', (req, res) => {
  const { username } = req.body

  const result = models.com_users.findOne({
    where: {
      user_name: username,
    },
    attributes: ['username'],
  })

  res.send(result)
})

export default router
