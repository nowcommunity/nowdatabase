import { Editable, EditDataType, Species, SpeciesDetailsType, SpeciesSynonym } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm, EditingFormField } from '@/components/DetailView/common/EditingForm'

export const SynonymTab = () => {
  const { mode, setEditData, editData } = useDetailContext<SpeciesDetailsType>()

  const columns: MRT_ColumnDef<SpeciesSynonym>[] = [
    {
      accessorKey: 'syn_genus_name',
      header: 'Genus',
    },
    {
      accessorKey: 'syn_species_name',
      header: 'Species',
    },
    {
      accessorKey: 'syn_comment',
      header: 'Comment',
    },
  ]

  const formFields: EditingFormField[] = [
    { name: 'syn_genus_name', label: 'Genus', required: true },
    { name: 'syn_species_name', label: 'Species', required: true },
    { name: 'syn_comment', label: 'Comment' },
  ]

  const editingForm = (
    <EditingForm<Species, SpeciesDetailsType>
      buttonText="Add new Species"
      formFields={formFields}
      editAction={(newSynonym: EditDataType<SpeciesSynonym>) => {
        setEditData({
          ...editData,
          com_taxa_synonym: [
            ...editData.com_taxa_synonym,
            {
              ...newSynonym,
              rowState: 'new',
            },
          ],
        })
      }}
    />
  )

  return (
    <>
      <Grouped title="Synonyms">
        {!mode.read && editingForm}
        <EditableTable<Editable<SpeciesSynonym>, SpeciesDetailsType> columns={columns} field="com_taxa_synonym" />
      </Grouped>
    </>
  )
}
