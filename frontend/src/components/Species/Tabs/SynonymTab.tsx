import { Editable, EditDataType, Species, SpeciesDetailsType, SpeciesSynonym } from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm, EditingFormField } from '@/components/DetailView/common/EditingForm'
import { useNotify } from '@/hooks/notification'
import { validateSynonym } from '@/shared/validators/synonym'
import { convertSynonymTaxonomyFields } from '@/util/taxonomyUtilities'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { skipToken } from '@reduxjs/toolkit/query'
import { CircularProgress } from '@mui/material'

export const SynonymTab = () => {
  const { mode, setEditData, editData } = useDetailContext<SpeciesDetailsType>()
  const { data: speciesQueryData, isFetching } = useGetAllSpeciesQuery(mode.read ? skipToken : undefined)
  const { notify } = useNotify()

  const convertAndCheckNewSynonymTaxonomy = (newSynonym: EditDataType<SpeciesSynonym>) => {
    const errors = []
    for (const field in newSynonym) {
      const errorObject = validateSynonym(
        newSynonym as unknown as EditDataType<SpeciesSynonym>,
        field as unknown as keyof EditDataType<SpeciesSynonym>
      )
      const { error } = errorObject
      if (error) errors.push(errorObject)
    }
    if (errors.length > 0) {
      notify('Following validators failed: \n' + errors.map(e => `${e.name}: ${e.error}`).join('\n'), 'error')
      return false
    }

    const convertedSynonym = convertSynonymTaxonomyFields(newSynonym)
    for (const existingSynonym of editData.com_taxa_synonym) {
      if (
        convertedSynonym.syn_genus_name === existingSynonym.syn_genus_name &&
        convertedSynonym.syn_species_name === existingSynonym.syn_species_name
      ) {
        notify(
          `${convertedSynonym.syn_genus_name} ${convertedSynonym.syn_species_name} \
          has already been added as a synonym for this species.`,
          'error',
          null
        )
        return false
      }
    }

    for (const existingSpecies of speciesQueryData!) {
      if (
        convertedSynonym.syn_genus_name === existingSpecies.genus_name &&
        convertedSynonym.syn_species_name === existingSpecies.species_name
      ) {
        notify(
          `${convertedSynonym.syn_genus_name} ${convertedSynonym.syn_species_name} \
          has already been created as a separate species, adding it as a synonym is currently not allowed.`,
          'error',
          null
        )
        return false
      }
    }

    return convertedSynonym
  }

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
      buttonText="Add synonym"
      formFields={formFields}
      editAction={(newSynonym: EditDataType<SpeciesSynonym>) => {
        const convertedSynonym = convertAndCheckNewSynonymTaxonomy(newSynonym)
        if (!convertedSynonym) return
        setEditData({
          ...editData,
          com_taxa_synonym: [
            ...editData.com_taxa_synonym,
            {
              ...convertedSynonym,
              rowState: 'new',
            },
          ],
        })
      }}
    />
  )

  if (isFetching) return <CircularProgress />

  return (
    <>
      <Grouped title="Synonyms">
        {!mode.read && editingForm}
        <EditableTable<Editable<SpeciesSynonym>, SpeciesDetailsType> columns={columns} field="com_taxa_synonym" />
      </Grouped>
    </>
  )
}
