import { ReferenceDetailsType, ReferenceAuthorType } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetReferenceAuthorsQuery } from '@/redux/referenceReducer'
import { Box } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import { MRT_ColumnDef } from 'material-react-table'

export const AuthorTab = ({field_num_param}) => {
  const { mode, editData, setEditData } = useDetailContext<ReferenceDetailsType>()

  console.log(mode, editData, setEditData)
  const { data: authorData, isError } = useGetReferenceAuthorsQuery(mode.read ? skipToken : undefined)

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
    { name: 'field_id', label: 'Field ID', required: true },
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
    <Grouped title="Authors">
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
                  field_num: field_num_param,
                  au_num: newAuthor.au_num,
                  rowState: 'new',
                },
              ];
            
              setEditData({
                ...editData,
                ref_authors: updatedAuthors, // Update the ref_authors array
                visible_ref_authors: updatedAuthors.filter((author) => author.field_num === field_num_param) // Filter using updatedAuthors, not editData.ref_authors
              })
            
              console.log('inside the thing');
              console.log(editData.visible_ref_authors)
            }}
          />
          <SelectingTable<ReferenceAuthorType, ReferenceDetailsType>
            buttonText="Select Author"
            data={authorData}
            isError={isError}
            columns={authorColumns}
            fieldName="ref_authors"
            idFieldName="au_num"
            editAction={(newAuthor: ReferenceAuthorType) => {
              const updatedAuthors = [
                ...editData.ref_authors,
                {
                  rid: editData.rid,
                  author_initials: newAuthor.author_initials,
                  author_surname: newAuthor.author_surname,
                  field_num: field_num_param,
                  au_num: newAuthor.au_num,
                  rowState: 'new',
                },
              ];
            
              setEditData({
                ...editData,
                ref_authors: updatedAuthors, // Update the ref_authors array
                visible_ref_authors: updatedAuthors.filter((author) => author.field_num === field_num_param) // Filter using updatedAuthors, not editData.ref_authors
              });
            
              console.log('inside the thing');
              console.log(editData.visible_ref_authors); // Log filtered updatedAuthors
            }}
          />
        </Box>
      )}
      <EditableTable<ReferenceAuthorType, ReferenceDetailsType> columns={referenceAuthorColumns} field="ref_authors" />
    </Grouped>
  )
}
