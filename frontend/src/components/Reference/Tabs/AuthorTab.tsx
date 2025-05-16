import React, { useEffect } from 'react'
import { ReferenceDetailsType, ReferenceAuthorType, RowState, EditDataType } from '@/shared/types'
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

const tabNameToButtonText: { [tabName: string]: string } = {
  Authors: 'author',
  Editors: 'editor',
  'Series Editors': 'editor',
  'Editors of Issue': 'editor',
  Sender: 'sender',
  Recipient: 'recipient',
  Recipients: 'recipient',
}

function checkIndexes(editData: EditDataType<ReferenceDetailsType>): boolean {
  let needsUpdate = false
  // First, check if any index is incorrect
  for (let i = 0; i < editData.ref_authors.length; i++) {
    if (editData.ref_authors[i].index !== i) {
      needsUpdate = true
      break
    }
  }
  return needsUpdate
}

export const AuthorTab: React.FC<AuthorTabProps> = ({ field_num_param, tab_name = 'Authors' }) => {
  const { mode, editData, setEditData, fieldsWithErrors } = useDetailContext<ReferenceDetailsType>()
  const { data: authorData, isError } = useGetReferenceAuthorsQuery(mode.read ? skipToken : undefined)
  const hasError = !!fieldsWithErrors.ref_authors

  useEffect(() => {
    // Check and update indexes of authors only if they are incorrect
    if (checkIndexes(editData)) {
      setEditData({
        ...editData,
        ref_authors: editData.ref_authors.map((ref_author, index) => ({
          ...ref_author,
          index,
        })),
      })
    }
  }, [editData, setEditData])

  let visible_ref_authors: Array<ReferenceAuthorType> = editData.ref_authors.filter(author => {
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
  ]
  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'author_initials', label: 'Author initials', required: true },
    { name: 'author_surname', label: 'Surname', required: true },
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
  ]

  let buttonText = 'Author'
  if (tab_name && tabNameToButtonText[tab_name]) {
    buttonText = tabNameToButtonText[tab_name]
  }

  let title = tab_name ? tab_name : 'Authors'
  if (hasError) title = title.concat(' (Required)')

  return (
    <Box>
      <Grouped error={hasError} title={title}>
        {!mode.read && (
          <Box display="flex" gap={1}>
            <EditingForm<ReferenceAuthorType, ReferenceDetailsType>
              buttonText={`Add new ${buttonText}`}
              formFields={formFields}
              editAction={(newAuthor: ReferenceAuthorType) => {
                const updatedAuthors = [
                  ...editData.ref_authors,
                  {
                    ...newAuthor,
                    rid: editData.rid,
                    au_num: editData.ref_authors.filter(author => author.field_id === field_num_param).length + 1,
                    field_id: field_num_param,
                    rowState: 'new' as RowState,
                  },
                ]

                setEditData({
                  ...editData,
                  ref_authors: [...updatedAuthors],
                })
                visible_ref_authors = updatedAuthors.filter(
                  author => author.field_id?.toString() == field_num_param?.toString()
                )
              }}
            />
            <SelectingTable<ReferenceAuthorType, ReferenceDetailsType>
              buttonText={`Select ${buttonText}`}
              data={authorData}
              isError={isError}
              columns={authorColumns}
              fieldName="ref_authors"
              idFieldName="data_id"
              editingAction={(newAuthor: ReferenceAuthorType) => {
                const updatedAuthors = [
                  ...editData.ref_authors,
                  {
                    ...newAuthor,
                    rid: editData.rid,
                    au_num: editData.ref_authors.filter(author => author.field_id === field_num_param).length + 1,
                    field_id: field_num_param,
                    rowState: 'new' as RowState,
                  },
                ]

                setEditData({
                  ...editData,
                  ref_authors: [...updatedAuthors],
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
          useDefinedIndex={true}
        />
      </Grouped>
    </Box>
  )
}
