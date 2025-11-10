import { ContactModal } from './ContactModal'
import { useDetailContext } from '../Context/DetailContext'
import { usePageContext } from '@/components/Page'
import { useEmailMutation } from '@/redux/emailReducer'
import { useForm, Controller, UseFormSetValue } from 'react-hook-form'
import { Box, TextField, FormControlLabel, CircularProgress, Switch } from '@mui/material'
import { useUser } from '@/hooks/user'
import { useEffect } from 'react'
import { useNotify } from '@/hooks/notification'
import { useGetPersonDetailsQuery } from '@/redux/personReducer'
import { skipToken } from '@reduxjs/toolkit/query'

const formatContactEmail = (values: ContactFormValues) => {
  return `
  Subject: ${values.subject}\n
  Name: ${values.full_name}\n
  Email: ${values.email}\n
  Fast Reply Requested: ${values.fast_reply_requested ? 'Yes' : 'No'} \n
  Message: \n ${values.comments}
  `
}

type ContactFormValues = {
  subject: string
  full_name: string
  email: string
  fast_reply_requested: boolean
  comments: string
}

type RateLimitError = {
  status: string
  data: { message: string }
}

export const ContactForm = <T extends object>({
  buttonText,
  noContext,
}: {
  buttonText: string
  noContext?: boolean
}) => {
  const [sendEmailMutation] = useEmailMutation()
  const { trigger, getValues, register, setValue, control, formState } = useForm<ContactFormValues>()
  const { errors } = formState
  const { notify } = useNotify()
  const user = useUser()
  const { data: personData, isLoading: personQueryloading } = useGetPersonDetailsQuery(user.initials ?? skipToken)

  const onSend = async () => {
    const result = await trigger()
    if (!result) return false
    const values = getValues()
    const title = values.subject
    const message = formatContactEmail(values)

    const confirm = window.confirm(`Send email?`)
    if (!confirm) return false
    try {
      await sendEmailMutation({ title, message }).unwrap()
      notify('Email sent.')
    } catch (e) {
      const error = e as RateLimitError
      notify(error.data.message, 'error')
      return false
    }
    return true
  }

  if (personQueryloading) return <CircularProgress />

  const form = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <TextField
        sx={{ width: '25em' }}
        key="subject"
        label="Subject"
        defaultValue=""
        fullWidth
        {...register('subject', { required: true, validate: value => !!value.trim() })}
        disabled={!noContext}
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
        {...register('comments', { required: true, validate: value => !!value.trim() })}
        error={!!errors['comments']}
      />
      <br></br>
      Your contact information
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="full_name"
        label="Full Name"
        defaultValue={personData?.full_name ?? ''}
        fullWidth
        {...register('full_name', { required: true, validate: value => !!value.trim() })}
        error={!!errors['full_name']}
      />
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="email"
        label="Email"
        defaultValue={personData?.email ?? ''}
        {...register('email', { required: true, validate: value => !!value.trim() })}
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

  if (noContext) return <ContactModal {...{ buttonText, onSend }}>{form}</ContactModal>
  return <ContactFormDetailView<T> buttonText={buttonText} form={form} setValue={setValue} onSend={onSend} />
}

const ContactFormDetailView = <T extends object>({
  buttonText,
  onSend,
  form,
  setValue,
}: {
  buttonText: string
  onSend: () => Promise<boolean>
  form: JSX.Element
  setValue: UseFormSetValue<ContactFormValues>
}) => {
  const { data } = useDetailContext<T>()
  const { createTitle } = usePageContext<T>()
  const subjectFromContext = createTitle(data)

  useEffect(() => {
    setValue('subject', subjectFromContext)
  }, [setValue, subjectFromContext])

  return <ContactModal {...{ buttonText, onSend }}>{form}</ContactModal>
}
