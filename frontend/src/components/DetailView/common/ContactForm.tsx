import { ContactModal } from './ContactModal'
import { useDetailContext } from '../Context/DetailContext'
import { usePageContext } from '@/components/Page'
import { useEmailMutation } from '@/redux/emailReducer'
import { useForm, Controller } from 'react-hook-form'
import { Box, TextField, FormGroup, FormControlLabel, Switch } from '@mui/material'
import { useUser } from '@/hooks/user'
import { useEffect } from 'react'
import { useNotify } from '@/hooks/notification'

const formatContactEmail = (values: ContactFormValues) => {
  return `
  Subject: ${values.subject}\n
  Name: ${values.username}\n
  Email: ${values.email}\n
  Comments: ${values.comments}\n
  Fast Reply Requested: ${values.fast_reply_requested ? 'Yes' : 'No'}
  `
}

type ContactFormValues = {
  subject: string
  comments: string
  username: string
  email: string
  fast_reply_requested: boolean
}
export const ContactForm = <T extends object>({ buttonText }: { buttonText: string }) => {
  const { data } = useDetailContext<T>()
  const { createTitle } = usePageContext<T>()
  const [sendEmailMutation, { isSuccess, isError }] = useEmailMutation()
  const { register, trigger, getValues, control, formState } = useForm<ContactFormValues>()
  const { errors } = formState
  const notify = useNotify()
  const user = useUser()

  const onSend = async () => {
    const result = await trigger()
    if (!result) return false
    const values = getValues()
    const recipients = ['test_recipient@something.com']
    const title = `Contact request: ${subject}`
    const message = formatContactEmail(values)

    const confirm = window.confirm(`Send email?`)
    if (!confirm) return false
    void sendEmailMutation({ recipients, title, message })
    return true
  }

  useEffect(() => {
    if (isSuccess) {
      notify('Email sent.')
    } else if (isError) {
      notify('Could not send email. Error happened.', 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError])

  const subject = createTitle(data)

  const form = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      All fields need to be filled for the email to get sent. Note: currently sends emails to a testing account.
      <br></br>
      Enter your comments here
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="subject"
        label="Subject"
        defaultValue={subject.length > 0 ? subject : ''}
        fullWidth
        {...register('subject', { required: true })}
        error={!!errors['subject']}
      />
      <br></br>
      <TextField
        sx={{ width: '40em' }}
        key="comments"
        label="Comments"
        defaultValue=""
        fullWidth
        multiline
        minRows={5}
        {...register('comments', { required: true })}
        error={!!errors['comments']}
      />
      <br></br>
      Your contact information
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="username"
        label="Username"
        defaultValue={user && user.username ? user.username : ''}
        fullWidth
        {...register('username', { required: true })}
        error={!!errors['username']}
      />
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="email"
        label="Email"
        defaultValue=""
        {...register('email', { required: true })}
        error={!!errors['email']}
      />
      <Controller
        control={control}
        name="fast_reply_requested"
        defaultValue={false}
        render={({ field: { onChange, value } }) => (
          <FormControlLabel
            control={<Switch checked={value} onChange={onChange} />}
            label="Please contact me as soon as possible."
          />
        )}
      />
    </Box>
  )

  return <ContactModal {...{ buttonText, onSend }}>{form}</ContactModal>
}

// This is the same as ContactForm but it doesn't have context hooks, since table views do not have a context
export const ContactFormTableView = ({ buttonText }: { buttonText: string }) => {
  const [sendEmailMutation, { isSuccess, isError }] = useEmailMutation()
  const { register, trigger, getValues, formState } = useForm()
  const { errors } = formState
  const notify = useNotify()
  const user = useUser()

  const onSend = async () => {
    const result = await trigger()
    if (!result) return false
    const { subject, comments, name, email } = getValues()
    const recipients = ['test_recipient@something.com']
    const title = `Regarding ${subject}`
    const message = `Name: ${name}\n Email: ${email}\nComments: ${comments}`
    const confirm = window.confirm(`Send email?`)
    if (!confirm) return false
    void sendEmailMutation({ recipients, title, message })
    return true
  }

  useEffect(() => {
    if (isSuccess) {
      notify('Email sent.')
    } else if (isError) {
      notify('Could not send email. Error happened.', 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError])

  const form = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      All fields need to be filled for the email to get sent. Note: currently sends emails to a testing account.
      <br></br>
      Enter your comments here<br></br>
      <TextField
        sx={{ width: '25em' }}
        key="subject"
        label="Subject"
        defaultValue={''}
        fullWidth
        {...register('subject', { required: true })}
        error={!!errors['subject']}
      />
      <br></br>
      <TextField
        sx={{ width: '40em' }}
        key="comments"
        label="Comments"
        defaultValue=""
        fullWidth
        multiline
        minRows={5}
        {...register('comments', { required: true })}
        error={!!errors['comments']}
      />
      <br></br>
      Your contact information
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="username"
        label="Name"
        defaultValue={user && user.username ? user.username : ''}
        fullWidth
        {...register('username', { required: true })}
        error={!!errors['username']}
      />
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="email"
        label="Email"
        defaultValue=""
        {...register('email', { required: true })}
        error={!!errors['email']}
      />
    </Box>
  )

  return <ContactModal {...{ buttonText, onSend }}>{form}</ContactModal>
}
