/* eslint-disable react/prop-types */
import { ReferenceDetailsType, ReferenceAuthorType } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetReferenceAuthorsQuery } from '@/redux/referenceReducer'
import { Box } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import { type MRT_ColumnDef } from 'material-react-table'

interface AuthorTabProps {
  field_num_param: number
  tab_name?: string | null
}

export const AuthorTab: React.FC<AuthorTabProps> = ({ field_num_param, tab_name = 'Authors' }) => {
  const { mode, editData, setEditData } = useDetailContext<ReferenceDetailsType>()
  const { data: authorData, isError } = useGetReferenceAuthorsQuery(mode.read ? skipToken : undefined)

  let visible_ref_authors = editData.ref_authors.filter(author => {
    return author.field_id?.toString() === field_num_param?.toString()
  })

  const authorColumns: MRT_ColumnDef<ReferenceAuthorType>[] = [
    {
      accessorKey: 'author_initials',
      header: 'Author initials',
    },
    {
      accessorKey: 'author_surname',
      header: 'Surname',
    },
    {
      accessorKey: 'au_num',
      header: 'Author number',
    },
  ]
  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'author_initials', label: 'Author initials', required: true },
    { name: 'author_surname', label: 'Surname', required: true },
    { name: 'au_num', label: 'Author number', required: true },
  ]
  const referenceAuthorColumns: MRT_ColumnDef<ReferenceAuthorType>[] = [
    {
      accessorKey: 'author_initials',
      header: 'Author initials',
    },
    {
      accessorKey: 'author_surname',
      header: 'Surname',
    },
    {
      accessorKey: 'au_num',
      header: 'Author number',
    },
  ]

  return (
    <Grouped title={tab_name ? tab_name : 'Authors'}>
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<ReferenceAuthorType, ReferenceDetailsType>
            buttonText="Add new author"
            formFields={formFields}
            editAction={(newAuthor: ReferenceAuthorType) => {
              const updatedAuthors = [
                ...editData.ref_authors,
                {
                  rid: editData.rid,
                  author_initials: newAuthor.author_initials,
                  author_surname: newAuthor.author_surname,
                  field_id: field_num_param,
                  au_num: newAuthor.au_num,
                  rowState: 'new',
                },
              ]

              setEditData({
                ...editData,
                ref_authors: updatedAuthors,
              })
              visible_ref_authors = updatedAuthors.filter(
                author => author.field_id?.toString() == field_num_param?.toString()
              )
            }}
          />
          <SelectingTable<ReferenceAuthorType, ReferenceDetailsType>
            buttonText="Select Author"
            data={authorData}
            isError={isError}
            columns={authorColumns}
            fieldName="ref_authors"
            idFieldName="au_num"
            editingAction={(newAuthor: ReferenceAuthorType) => {
              const updatedAuthors = [
                ...editData.ref_authors,
                {
                  rid: editData.rid,
                  author_initials: newAuthor.author_initials,
                  author_surname: newAuthor.author_surname,
                  field_id: field_num_param,
                  au_num: newAuthor.au_num,
                  rowState: 'new',
                },
              ]

              setEditData({
                ...editData,
                ref_authors: updatedAuthors,
              })
              visible_ref_authors = updatedAuthors.filter(
                author => author.field_id?.toString() == field_num_param?.toString()
              )
            }}
          />
        </Box>
      )}
      <EditableTable<ReferenceAuthorType, ReferenceDetailsType>
        columns={referenceAuthorColumns}
        field="ref_authors"
        visible_data={visible_ref_authors}
      />
    </Grouped>
  )
}
