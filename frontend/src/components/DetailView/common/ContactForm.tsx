import { Box, TextField } from '@mui/material'
import { ContactModal } from './ContactModal'
import { useForm } from 'react-hook-form'
import { Editable, EditDataType } from '@/shared/types'
import { useDetailContext } from '../Context/DetailContext'
import { usePageContext } from '@/components/Page'

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
  const onSend = () => {
    // TODO
  }
  console.log(editData)
  const subject = createTitle(data)
  return <ContactModal {...{ buttonText, onSend, subject }}></ContactModal>
}
