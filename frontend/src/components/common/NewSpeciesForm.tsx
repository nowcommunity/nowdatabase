import { taxonStatusSelectOptions } from '@/constants/taxonStatusOptions'
import { useNotify } from '@/hooks/notification'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import {
  EditDataType,
  LocalityDetailsType,
  LocalitySpeciesDetailsType,
  Role,
  Species,
  SpeciesDetailsType,
} from '@/shared/types'
import { validateSpecies } from '@/shared/validators/species'
import {
  checkSpeciesTaxonomy,
  convertSpeciesTaxonomyFields,
  fixNullValuesInTaxonomyFields,
  TaxonomySpecies,
} from '@/util/taxonomyUtilities'
import { useUser } from '@/hooks/user'
import { Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useMemo, useState } from 'react'
import { applyDefaultSpeciesOrdering } from '../DetailView/common/DetailTabTable'
import { EditingForm, EditingFormField } from '../DetailView/common/EditingForm'
import { SelectingTable } from '../DetailView/common/SelectingTable'
import { SynonymsModal } from '../Species/SynonymsModal'
import { toSpeciesDetailsDraft } from './toSpeciesDetailsDraft'

const smallSpeciesTableColumns: MRT_ColumnDef<Species>[] = [
  {
    accessorKey: 'subclass_or_superorder_name',
    header: 'Subclass or Superorder',
  },
  {
    accessorKey: 'order_name',
    header: 'Order',
  },
  {
    accessorKey: 'suborder_or_superfamily_name',
    header: 'Suborder or Superfamily',
  },
  {
    accessorKey: 'family_name',
    header: 'Family',
  },
  {
    accessorKey: 'subfamily_name',
    header: 'Subfamily or Tribe',
  },
  {
    accessorKey: 'genus_name',
    header: 'Genus',
  },
  {
    accessorKey: 'species_name',
    header: 'Species',
  },
  {
    accessorKey: 'unique_identifier',
    header: 'Unique Identifier',
  },
  {
    accessorKey: 'taxonomic_status',
    header: 'Taxon status',
  },
]
const formFields: EditingFormField[] = [
  { name: 'order_name', label: 'Order', required: true },
  { name: 'family_name', label: 'Family', required: true },
  { name: 'genus_name', label: 'Genus', required: true },
  { name: 'species_name', label: 'Species', required: true },
  { name: 'subclass_or_superorder_name', label: 'Subclass or Superorder' },
  { name: 'suborder_or_superfamily_name', label: 'Suborder or Superfamily' },
  { name: 'subfamily_name', label: 'Subfamily or Tribe' },
  {
    name: 'unique_identifier',
    label: 'Unique Identifier',
    required: true,
    requiredMessage: 'Unique Identifier must have a value.',
  },
  { name: 'taxonomic_status', label: 'Taxon status', selectOptions: taxonStatusSelectOptions },
  { name: 'sp_comment', label: 'Comment' },
  { name: 'sp_author', label: 'Author' },
]

export const NewSpeciesForm = ({
  existingLocalitySpecies,
  afterTaxonomyCheck,
}: {
  existingLocalitySpecies?: EditDataType<LocalitySpeciesDetailsType>[]
  afterTaxonomyCheck: (newSpecies: EditDataType<Species>) => void
}) => {
  const { notify } = useNotify()
  const user = useUser()
  const { data: speciesData, isError } = useGetAllSpeciesQuery()

  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [replacedValues, setReplacedValues] = useState<EditDataType<Species> | undefined>()

  const sortedSpeciesData = useMemo(() => {
    return applyDefaultSpeciesOrdering(speciesData)
  }, [speciesData])

  const getDraftExistingTaxa = (): TaxonomySpecies[] =>
    (existingLocalitySpecies ?? [])
      .map(localitySpecies => localitySpecies.com_species)
      .filter((species): species is EditDataType<SpeciesDetailsType> => Boolean(species))
      .map(species => ({
        species_id: species.species_id,
        subclass_or_superorder_name: species.subclass_or_superorder_name,
        order_name: species.order_name,
        suborder_or_superfamily_name: species.suborder_or_superfamily_name,
        family_name: species.family_name,
        subfamily_name: species.subfamily_name,
        genus_name: species.genus_name,
        species_name: species.species_name,
        unique_identifier: species.unique_identifier,
      }))

  const getTaxonomyConfirmation = (newSpecies: EditDataType<Species>) => {
    if (user.role !== Role.Admin || !speciesData) return undefined

    const convertedSpecies = convertSpeciesTaxonomyFields(newSpecies)
    const taxonomyValues = [
      convertedSpecies.subclass_or_superorder_name,
      convertedSpecies.order_name,
      convertedSpecies.suborder_or_superfamily_name,
      convertedSpecies.family_name,
      convertedSpecies.subfamily_name,
      convertedSpecies.genus_name,
      convertedSpecies.species_name,
    ]
    if (!taxonomyValues.some(value => value?.trim())) return undefined

    let hierarchyErrors: string[] = []
    checkSpeciesTaxonomy(convertedSpecies, [...speciesData, ...getDraftExistingTaxa()], [], {
      onTaxonomyHierarchyMismatch: errors => {
        hierarchyErrors = errors
      },
    })
    if (hierarchyErrors.length === 0) return undefined

    return {
      key: JSON.stringify([
        convertedSpecies.subclass_or_superorder_name,
        convertedSpecies.order_name,
        convertedSpecies.suborder_or_superfamily_name,
        convertedSpecies.family_name,
        convertedSpecies.subfamily_name,
        convertedSpecies.genus_name,
        convertedSpecies.species_name,
        convertedSpecies.unique_identifier,
      ]),
      message: `${hierarchyErrors.join('\n')}\nConfirm that you understand the mismatch before adding the species.`,
    }
  }

  const copyTaxonomyButton = (
    <Box key="copy_existing_taxonomy_button">
      <SelectingTable<Species, Species>
        dataCy="copy_existing_taxonomy_button"
        buttonText="Copy existing taxonomy"
        title="Copy existing taxonomy"
        data={sortedSpeciesData}
        isError={isError}
        columns={smallSpeciesTableColumns}
        fieldName="order_name" // this doesn't do anything here but is required
        idFieldName="species_id"
        useObject={true}
        closeOnSelect={true}
        tableRowAction={row => {
          setSelectedSpecies(row.species_id.toString())
          setModalOpen(true)
        }}
        editingAction={(selectedSpecies: Species) => {
          const fixedSpecies = fixNullValuesInTaxonomyFields(selectedSpecies)
          setReplacedValues({
            subclass_or_superorder_name: fixedSpecies.subclass_or_superorder_name,
            order_name: fixedSpecies.order_name!,
            suborder_or_superfamily_name: fixedSpecies.suborder_or_superfamily_name,
            family_name: fixedSpecies.family_name!,
            subfamily_name: fixedSpecies.subfamily_name,
            genus_name: fixedSpecies.genus_name!,
            species_name: fixedSpecies.species_name!,
            unique_identifier: fixedSpecies.unique_identifier!,
            taxonomic_status: '',
            sp_comment: '',
            sp_author: '',
          })
        }}
      />
      <SynonymsModal open={modalOpen} onClose={() => setModalOpen(false)} selectedSpecies={selectedSpecies} />
    </Box>
  )

  const convertAndCheckNewSpeciesTaxonomy = (newSpecies: EditDataType<Species>) => {
    const speciesForValidation = toSpeciesDetailsDraft(newSpecies)
    const fieldsToValidate: Array<keyof EditDataType<SpeciesDetailsType>> = [
      'subclass_or_superorder_name',
      'order_name',
      'suborder_or_superfamily_name',
      'family_name',
      'subfamily_name',
      'genus_name',
      'species_name',
      'taxonomic_status',
      'unique_identifier',
    ]

    const errors = fieldsToValidate
      .map(fieldName => validateSpecies(speciesForValidation, fieldName))
      .filter(({ error }) => Boolean(error))

    if (errors.length > 0) {
      notify('Following validators failed: \n' + errors.map(e => `${e.name}: ${e.error}`).join('\n'), 'error')
      return false
    }

    const convertedSpecies = convertSpeciesTaxonomyFields(newSpecies)

    const taxonomyErrors = checkSpeciesTaxonomy(
      convertedSpecies,
      [...(speciesData ?? []), ...getDraftExistingTaxa()],
      [],
      { allowTaxonomyHierarchyMismatch: user.role === Role.Admin }
    )
    if (taxonomyErrors.size > 0) {
      const errorMessage = [...taxonomyErrors].reduce((acc, currentError) => acc + `\n${currentError}`)
      notify(errorMessage, 'error', null)
      return false
    }
    return convertedSpecies
  }
  return (
    <EditingForm<EditDataType<Species>, LocalityDetailsType>
      buttonText="Add new Species"
      formFields={formFields}
      existingObject={{ unique_identifier: '-' }}
      replacedValues={replacedValues}
      copyTaxonomyButton={copyTaxonomyButton}
      getConfirmation={getTaxonomyConfirmation}
      editAction={(newSpecies: EditDataType<Species>) => {
        const convertedSpecies = convertAndCheckNewSpeciesTaxonomy(newSpecies)
        if (!convertedSpecies) return false
        afterTaxonomyCheck(convertedSpecies)
        return true
      }}
    />
  )
}
