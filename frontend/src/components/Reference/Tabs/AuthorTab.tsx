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

export const AuthorTab = () => {
  const { mode, editData, setEditData } = useDetailContext<ReferenceDetailsType>()
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
    {
      accessorKey: 'field_id',
      header: 'Field ID',
    },
  ]/*
  const localitySpeciesColumns: MRT_ColumnDef<LocalitySpecies>[] = [
    {
      accessorKey: 'com_species.order_name',
      header: 'Order',
    },
    {
      accessorKey: 'com_species.family_name',
      header: 'Family',
    },
    {
      accessorKey: 'com_species.genus_name',
      header: 'Genus',
    },
    {
      accessorKey: 'com_species.species_name',
      header: 'Species',
    },
    {
      accessorKey: 'com_species.subclass_or_superorder_name',
      header: 'Subclass or Superorder',
    },
    {
      accessorKey: 'com_species.suborder_or_superfamily_name',
      header: 'Suborder or Superfamily',
    },
    {
      accessorKey: 'com_species.unique_identifier',
      header: 'Unique Identifier',
    },
    {
      accessorKey: 'com_species.taxonomic_status',
      header: 'Taxon status',
    },
  ]*/
  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'author_initials', label: 'Author initials', required: true },
    { name: 'author_surname', label: 'Surname', required: true },
    { name: 'au_num', label: 'Author number', required: true },
    { name: 'field_id', label: 'Field ID', required: true },
  ]

  return (
    <Grouped title="Authors">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<ReferenceAuthorType, ReferenceDetailsType>
            buttonText="Add new suthor"
            formFields={formFields}
            editAction={(newAuthor: ReferenceAuthorType) => {
              setEditData({
                ...editData,
                ref_authors: [
                  ...editData.ref_authors,
                  {
                    au_num: newAuthor.au_num,
                   // ref_authors: { ...(newAuthor as ReferenceAuthorType) },
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
            idFieldName="rid"
            editingAction={(newAuthor: ReferenceAuthorType) => {
              setEditData({
                ...editData,
                ref_authors: [
                  ...editData.ref_authors,
                  {
                    au_num: newAuthor.au_num,
             //       com_species: { ...(newSpecies as SpeciesDetailsType) },
                    rowState: 'new',
                  },
                ],
              })
            }}
          />
        </Box>
      )}
      <EditableTable<ReferenceAuthorType, ReferenceDetailsType> columns={authorColumns} field="ref_authors" />
    </Grouped>
  )
}
