import { ReferenceDetailsType, ReferenceJournalType } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetReferenceJournalsQuery } from '@/redux/referenceReducer'
import { Box } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import { type MRT_ColumnDef } from 'material-react-table'

export const JournalTab = ({tab_name}) => {
  const { mode, editData, setEditData } = useDetailContext<ReferenceDetailsType>()
  const { data: journalData, isError } = useGetReferenceJournalsQuery(mode.read ? skipToken : undefined)

  const journalColumns: MRT_ColumnDef<ReferenceJournalType>[] = [
    {
      accessorKey: 'journal_title',
      header: 'Journal Title',
    },
    {
      accessorKey: 'short_title',
      header: 'Short title',
    },
    {
      accessorKey: 'alt_title',
      header: 'Alternative title',
    },
    {
      accessorKey: 'ISSN',
      header: 'ISSN',
    },
  ]
  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'journal_title', label: 'Journal Title', required: true },
    { name: 'short_title', label: 'Short title', required: false },
    { name: 'alt_title', label: 'Alternative title', required: false },
    { name: 'ISSN', label: 'ISSN', required: true },
  ]
  const referenceJournalColumns: MRT_ColumnDef<ReferenceJournalType>[] = [
    {
      accessorKey: 'journal_title',
      header: 'Journal Title',
    },
    {
      accessorKey: 'short_title',
      header: 'Short title',
    },
    {
      accessorKey: 'alt_title',
      header: 'Alternative title',
    },
    {
      accessorKey: 'ISSN',
      header: 'ISSN',
    },
  ]

  return (
    <Grouped title={tab_name}>
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<ReferenceJournalType, ReferenceDetailsType>
            buttonText="Add new journal"
            formFields={formFields}
            editAction={(newJournal: ReferenceJournalType) => {
              const updatedJournal = [
                {
                  journal_title: newJournal.journal_title,
                  short_title: newJournal.short_title,
                  alt_title: newJournal.alt_title,
                  ISSN: newJournal.ISSN,
                  rowState: 'new',
                },
              ];
            
              setEditData({
                ...editData,
                ref_journal: updatedJournal
              })
            }}
          />
          <SelectingTable<ReferenceJournalType, ReferenceDetailsType>
            buttonText="Select Journal"
            data={journalData}
            isError={isError}
            columns={journalColumns}
            fieldName="ref_journal"
            idFieldName="journal_id"
            editAction={(newJournal: ReferenceJournalType) => {
              const updatedJournal = [
                {
                  journal_title: newJournal.journal_title,
                  short_title: newJournal.short_title,
                  alt_title: newJournal.alt_title,
                  ISSN: newJournal.ISSN,
                  rowState: 'new',
                },
              ]
            
              setEditData({
                ...editData,
                ref_journal: updatedJournal
              });
            }}
          />
        </Box>
      )}
      <EditableTable<ReferenceJournalType, ReferenceDetailsType> columns={referenceJournalColumns} field="ref_journal"/>
    </Grouped>
  )
}
