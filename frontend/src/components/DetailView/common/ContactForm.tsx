import { ContactModal } from './ContactModal'
import { useDetailContext } from '../Context/DetailContext'
import { usePageContext } from '@/components/Page'
import { useEmailMutation } from '@/redux/emailReducer'
import { useForm } from 'react-hook-form'
import { Box, TextField } from '@mui/material'
import { useUser } from '@/hooks/user'

export type ContactFormField = { name: string; label: string; required?: boolean }

/* 
Renders a button, that will open EditingModal, which can be used
to add a new entry to a list, or edit existing one.
If using for adding new, provide arrayFieldName.
For editing existing row, use existingObject and editAction.
*/
export const ContactForm = <T extends object>({ buttonText }: { buttonText: string }) => {
  const { data, editData } = useDetailContext<T>()
  const { createTitle } = usePageContext<T>()
  const [sendEmailMutation, { isSuccess, isLoading, isError }] = useEmailMutation()
  const { register, trigger, getValues } = useForm()
  const user = useUser()
  console.log(user)

  const onSend = async () => {
    const result = await trigger()
    console.log(result)
    if (!result) return false
    const { subject, comments, name, email } = getValues()
    const recipients = ['test_recipient@something.com']
    const title = `Regarding ${subject}`
    const message = `Name: ${name}\n Email: ${email}\nComments: ${comments}`
    const confirm = window.confirm(`Send email?`)
    if (!confirm) return
    void sendEmailMutation({ recipients, title, message })
  }

  const subject = createTitle(data)

  const form = (
    <Box marginBottom="2em" marginTop="1em">
      All fields need to be filled for the email to get sent. Note: currently sends emails to a testing account.
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="subject"
        label="Subject"
        defaultValue={subject.length > 0 ? subject : ''}
        fullWidth
        {...register('subject', { required: true })}
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
      />
      <br></br>
      Contact info:
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="name"
        label="Name"
        defaultValue={user && user.username ? user.username : ''}
        fullWidth
        {...register('name', { required: true })}
      />
      <br></br>
      <TextField
        sx={{ width: '25em' }}
        key="email"
        label="Email"
        defaultValue=""
        {...register('email', { required: true })}
      />
    </Box>
  )

  return <ContactModal {...{ buttonText, onSend }}>{form}</ContactModal>
}
