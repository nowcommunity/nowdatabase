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
import { CircularProgress } from '@mui/material'

export const AuthorTab = () => {
  const { data, mode, editData, setEditData } = useDetailContext<ReferenceDetailsType>()
 // console.log(mode, editData, setEditData)
  const { data: authorData, isError } = useGetReferenceAuthorsQuery(mode.read ? skipToken : undefined)
  //const { data: authorData, isError} = useGetReferenceAuthorsQuery()
  console.log(editData)
  console.log(editData.ref_authors, !editData.ref_authors)
  console.log(authorData, !authorData)
  
  if (!authorData || !editData.ref_authors){
    console.log('thisfailed')
    return <CircularProgress />
  }

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
    {
      accessorKey: 'field_id',
      header: 'Field ID',
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
    {
      accessorKey: 'field_id',
      header: 'Field ID',
    },
  ]

  console.log('before big return')
  return (
    <Grouped title="Authors">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<ReferenceAuthorType, ReferenceDetailsType>
            buttonText="Add new author"
            formFields={formFields}
            editAction={(newAuthor: ReferenceAuthorType) => {
              setEditData({
                ...editData,
                ref_authors: [
                  ...editData.ref_authors,
                  {
                    rid: editData.rid,
                    author_initials: newAuthor.author_initials,
                    author_surname: newAuthor.author_surname,
                    field_id: newAuthor.field_id,
                    au_num: newAuthor.au_num,
                   // ref_ref: { ...(editData as ReferenceDetailsType) },
                    rowState: 'new',
                  },
                ],
              })
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
              setEditData({
                ...editData,
                ref_authors: [
                  ...editData.ref_authors,
                  {
                    rid: editData.rid,
                    au_num: newAuthor.au_num,
                    author_initials: newAuthor.author_initials,
                    author_surname: newAuthor.author_surname,
                    field_id: newAuthor.field_id,
                  //  ref_ref: { ...(editData as ReferenceDetailsType) },
             //       com_species: { ...(newSpecies as SpeciesDetailsType) },
                    rowState: 'new',
                  },
                ],
              })
            }}
          />
        </Box>
      )}
      <EditableTable<ReferenceAuthorType, ReferenceDetailsType> columns={referenceAuthorColumns} field="ref_authors" />
    </Grouped>
  )
}
