import { Request, Router } from 'express'
import { createTransport, createTestAccount, getTestMessageUrl } from 'nodemailer'
import {
  CONTACT_FROM_EMAIL,
  CONTACT_FROM_NAME,
  CONTACT_SMTP_HOST,
  CONTACT_SMTP_PORT,
  EMAIL_RECIPIENT_ADDRESS,
  RUNNING_ENV,
} from '../utils/config'
import { logger } from '../utils/logger'
import { sleep } from '../utils/common'

const router = Router()

let emailSent: Date | null = null

// tests that email sending works when the program starts
createTestAccount(err => {
  if (err) {
    console.error('Failed to create a testing account. ' + err.message)
    return process.exit(1)
  }

  // Create a SMTP transporter object
  const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'morgan39@ethereal.email',
      pass: 'mWRbxn17K4RVFXw5SW',
    },
  })

  // Message object
  const message = {
    from: 'Sender Name <sender@example.com>',
    to: 'Recipient <recipient@example.com>',
    subject: 'Nodemailer is unicode friendly ✔',
    text: 'Hello to myself!',
    html: '<p><b>Hello</b> to myself!</p>',
  }

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log('Error occurred. ' + err.message)
      return process.exit(1)
    }

    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', getTestMessageUrl(info))
  })
})

// temporarily changed this to allow test emails
const transport =
  RUNNING_ENV === 'dev'
    ? createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'morgan39@ethereal.email',
          pass: 'mWRbxn17K4RVFXw5SW',
        },
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
      console.log('Emails already sent in the last minute, sending anyway because testing')
      //return res.status(400).json({ message: 'Emails already sent in last minute.' })
    }
    emailSent = new Date()
    logger.info(`Sending ${recipients.length} emails...`)
    for (const recipient of recipients) {
      await transport.sendMail({
        from: { name: 'test_from_name', address: 'test_from_address@something.com' },
        to: EMAIL_RECIPIENT_ADDRESS,
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
