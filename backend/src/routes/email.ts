import { Request, Router } from 'express'
import { createTransport } from 'nodemailer'
import {
  CONTACT_FROM_EMAIL,
  CONTACT_FROM_NAME,
  CONTACT_SMTP_HOST,
  CONTACT_SMTP_PORT,
  RUNNING_ENV,
} from '../utils/config'
import { logger } from '../utils/logger'
import { sleep } from '../utils/common'

const router = Router()

let emailSent: Date | null = null

const transport =
  RUNNING_ENV === 'prod'
    ? createTransport({
        host: CONTACT_SMTP_HOST,
        port: parseInt(CONTACT_SMTP_PORT!),
      })
    : null

router.post(
  '/',
  async (req: Request<object, object, { recipients: string[]; title: string; message: string }>, res) => {
    const { recipients, title, message } = req.body
    if (message.length === 0 || title.length === 0 || recipients.length === 0) {
      return res.status(400).json({ message: 'Please define recipients, title and message.' })
    }
    if (!transport) {
      logger.info(
        `Would have sent email with following data: \n${JSON.stringify({ recipients, title, message }, null, 2)}`
      )
      return res.status(200).json()
    }
    if (emailSent && new Date().getTime() - emailSent.getTime() < 60000) {
      return res.status(400).json({ message: 'Emails already sent in last minute.' })
    }
    emailSent = new Date()
    if (!CONTACT_FROM_NAME || !CONTACT_FROM_EMAIL || !CONTACT_SMTP_HOST || !CONTACT_SMTP_PORT) {
      return res.status(500).json({ message: 'Server is missing configurations for sending emails.' })
    }
    logger.info(`Sending ${recipients.length} emails...`)
    for (const recipient of recipients) {
      await transport.sendMail({
        from: { name: CONTACT_FROM_NAME, address: CONTACT_FROM_EMAIL },
        to: recipient,
        subject: title,
        text: message,
      })
      await sleep(200)
    }
    logger.info(`Sent ${recipients.length} emails with title '${title}'.`)
    return res.status(200).json()
  }
)

export default router
