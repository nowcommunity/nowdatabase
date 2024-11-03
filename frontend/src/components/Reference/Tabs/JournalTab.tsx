/* eslint-disable react/prop-types */
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

interface JournalTabProps {
  tab_name?: string | null
}

export const JournalTab: React.FC<JournalTabProps> = ({ tab_name = 'Journal' }) => {
  const { mode, editData, setEditData } = useDetailContext<ReferenceDetailsType>()
  const { data: journalData, isError } = useGetReferenceJournalsQuery(mode.read ? skipToken : undefined)
  let visible_ref_journal: Array<ReferenceJournalType> = []
  if (editData.ref_journal && Object.keys(editData.ref_journal).length !== 0) {
    visible_ref_journal = [Object.assign({}, editData.ref_journal)]
  }

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
    { name: 'ISSN', label: 'ISSN', required: false },
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
    <Grouped title={tab_name ? tab_name : 'Journal'}>
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<ReferenceJournalType, ReferenceDetailsType>
            buttonText="Add new journal"
            formFields={formFields}
            editAction={(newJournal: ReferenceJournalType) => {
              setEditData({
                ...editData,
                journal_id: undefined,
                ref_journal: { ...newJournal, journal_id: undefined, rowState: 'new' },
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
            useObject={true}
            editingAction={(newJournal: ReferenceJournalType) => {
              setEditData({
                ...editData,
                journal_id: newJournal.journal_id,
                ref_journal: { ...newJournal, rowState: 'new' },
              })
            }}
          />
        </Box>
      )}
      <EditableTable<ReferenceJournalType, ReferenceDetailsType>
        columns={referenceJournalColumns}
        field="ref_journal"
        visible_data={visible_ref_journal}
        useObject={true}
      />
    </Grouped>
  )
}
