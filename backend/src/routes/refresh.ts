import { Request, Router } from 'express'
import { verify } from '../middlewares/authenticator'
import { Secret, sign } from 'jsonwebtoken'
import { AccessError } from '../middlewares/authorizer'
import { SECRET, GRACE_PERIOD_SECONDS, LOGIN_VALID_SECONDS } from '../utils/config'
import { nowDb } from '../utils/db'

const router = Router()

router.post('/refreshToken', async (req: Request<object, { token: string }, { token: string }>, res) => {
  if (!req.body.token) throw new AccessError()
  const oldToken = req.body.token
  const {
    username,
    exp,
    id: userId,
  } = (await verify(oldToken, SECRET as Secret, true)) as { username: string; exp: number; id: number }

  const now = new Date().getTime()
  console.log({ now, exp, grace: GRACE_PERIOD_SECONDS })
  if (now > exp * 1000 + GRACE_PERIOD_SECONDS * 1000) throw new AccessError('Token expired. You must login again.')

  const foundUser = await nowDb.com_users.findFirst({
    where: {
      user_name: username,
      user_id: userId,
    },
    select: { user_name: true, user_id: true },
  })

  if (!foundUser) throw new AccessError()

  const token = sign({ username: foundUser.user_name, id: foundUser.user_id }, SECRET, {
    expiresIn: LOGIN_VALID_SECONDS,
  })

  res.status(200).json({ token })
})

export default router
