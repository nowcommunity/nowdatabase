import { emptySpecies } from '@/components/DetailView/common/defaultValues'
import { applyDefaultSpeciesOrdering, hasActiveSortingInSearch } from '@/components/DetailView/common/DetailTabTable'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import {
  DropdownOption,
  DropdownSelector,
  DropdownSelectorWithSearch,
  EditableTextField,
  RadioSelector,
} from '@/components/DetailView/common/editingComponents'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { EntryUpdateHistory } from '@/components/DetailView/common/FieldUpdateHistory'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import {
  DetailContextProvider,
  modeOptionToMode,
  useDetailContext,
} from '@/components/DetailView/Context/DetailContext'
import { FieldsWithErrorsType, OptionalRadioSelectionProps, TextFieldOptions } from '@/components/DetailView/DetailView'
import { emptyOccurrence } from '@/components/Occurrence/emptyOccurrence'
import { OccurrenceCoreTab } from '@/components/Occurrence/Tabs/OccurrenceCoreTab'
import { OccurrenceIsotopeTab } from '@/components/Occurrence/Tabs/OccurrenceIsotopeTab'
import { OccurrenceWearTab } from '@/components/Occurrence/Tabs/OccurrenceWearTab'
import {
  exportOccurrenceMapKml,
  exportOccurrenceMapSvg,
  getUniqueLocalityOccurrenceMapExportLocalities,
} from '@/components/Species/localitySpeciesMapExport'
import { occurrenceLabels } from '@/constants/occurrenceLabels'
import { useNotify } from '@/hooks/notification'
import {
  Editable,
  EditableOccurrenceData,
  EditDataType,
  LocalityDetailsType,
  LocalitySpecies,
  LocalitySpeciesDetailsType,
  OccurrenceDetailsType,
  SpeciesDetailsType,
} from '@/shared/types'
import { calculateNormalizedMesowearScore } from '@/shared/utils/mesowear'
import { validateOccurrence, validateOccurrenceFields } from '@/shared/validators/occurrence'
import { ValidationObject } from '@/shared/validators/validator'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, DialogActions, DialogContent, Tooltip } from '@mui/material'
import type { MRT_ColumnDef, MRT_Row, MRT_RowData, MRT_TableInstance } from 'material-react-table'
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const hasMesowearScoreInputs = (row: LocalitySpecies) => {
  return (
    'mw_scale_min' in row &&
    'mw_scale_max' in row &&
    'mw_value' in row &&
    row.mw_scale_min !== undefined &&
    row.mw_scale_max !== undefined &&
    row.mw_value !== undefined
  )
}

const occurrenceFields: Array<keyof EditableOccurrenceData> = [
  'nis',
  'pct',
  'quad',
  'mni',
  'qua',
  'id_status',
  'orig_entry',
  'source_name',
  'body_mass',
  'mesowear',
  'mw_or_high',
  'mw_or_low',
  'mw_cs_sharp',
  'mw_cs_round',
  'mw_cs_blunt',
  'mw_scale_min',
  'mw_scale_max',
  'mw_value',
  'microwear',
  'dc13_mean',
  'dc13_n',
  'dc13_max',
  'dc13_min',
  'dc13_stdev',
  'do18_mean',
  'do18_n',
  'do18_max',
  'do18_min',
  'do18_stdev',
]

const NewOccurrenceDialogContent = ({
  onSave,
  onClose,
  localityData,
  validateOccurrenceFields,
}: {
  onSave: (
    occurrenceSpecificFields: EditDataType<OccurrenceDetailsType>,
    comSpecies: EditDataType<SpeciesDetailsType>
  ) => void
  onClose: () => void
  localityData: EditDataType<LocalityDetailsType> | undefined
  validateOccurrenceFields: (editData: EditDataType<OccurrenceDetailsType>) => ValidationObject[]
}) => {
  const { editData, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<OccurrenceDetailsType>()
  const { notify } = useNotify()

  const validateAllFields = () => {
    const nextFieldsWithErrors: FieldsWithErrorsType = {}

    for (const errorObject of validateOccurrenceFields(editData)) {
      nextFieldsWithErrors[String(errorObject.field ?? errorObject.name)] = errorObject
    }

    setFieldsWithErrors(() => nextFieldsWithErrors)
    return Object.keys(nextFieldsWithErrors).length === 0
  }

  const speciesSelected = () => {
    return editData.species_name && editData.species_name.length > 0
  }

  const handleSave = () => {
    if (!validateAllFields()) {
      notify('Please fix occurrence validation errors before saving.', 'error')
      return
    }

    try {
      const occurrenceSpecificFields = occurrenceFields.reduce<Record<string, unknown>>((data, field) => {
        if (field in editData) data[field] = editData[field]
        return data
      }, {})

      const comSpecies: EditDataType<SpeciesDetailsType> = {
        ...emptySpecies,
        species_id: editData.species_id ?? undefined,
        order_name: editData.order_name ?? emptySpecies.order_name,
        genus_name: editData.genus_name ?? emptySpecies.genus_name,
        family_name: editData.family_name ?? emptySpecies.family_name,
        species_name: editData.species_name ?? emptySpecies.species_name,
        unique_identifier: editData.unique_identifier ?? emptySpecies.unique_identifier,
      }

      onSave({ ...occurrenceSpecificFields, now_oau: [] }, comSpecies)
      onClose()
    } catch (e) {
      notify('Something went wrong when trying to add the Occurrence.', 'error')
    }
  }

  return (
    <>
      <DialogContent dividers>
        <OccurrenceCoreTab
          clickableLocName={false}
          existingOccurrences={(localityData?.now_ls ?? []) as Array<LocalitySpeciesDetailsType>}
        />
        <OccurrenceWearTab />
        <OccurrenceIsotopeTab />
      </DialogContent>
      <DialogActions>
        <Button id="occurrence-creation-modal-cancel-button" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!speciesSelected() || Object.keys(fieldsWithErrors).length > 0}
          onClick={() => void handleSave()}
          startIcon={<SaveIcon />}
          variant="contained"
        >
          Save occurrence
        </Button>
      </DialogActions>
    </>
  )
}

export const OccurrencesTab = () => {
  const { mode, data, editData, setEditData } = useDetailContext<LocalityDetailsType>()
  const [fieldsWithErrors, setFieldsWithErrors] = useState<FieldsWithErrorsType>({})
  const location = useLocation()

  const sortedOccurrenceRows = useMemo(() => {
    const sourceRows = (mode.read ? data.now_ls : editData.now_ls) as unknown as Editable<LocalitySpecies>[]
    return (
      applyDefaultSpeciesOrdering(sourceRows, {
        prefix: 'com_species',
        skip: hasActiveSortingInSearch(location.search),
      }) ?? sourceRows
    )
  }, [data.now_ls, editData.now_ls, location.search, mode.read])

  const columns: MRT_ColumnDef<LocalitySpecies>[] = [
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
      accessorKey: 'com_species.subfamily_name',
      header: 'Subfamily or Tribe',
    },
    {
      accessorKey: 'com_species.unique_identifier',
      header: 'Unique Identifier',
    },
    {
      accessorKey: 'com_species.taxonomic_status',
      header: 'Taxon status',
    },
    {
      accessorKey: 'id_status',
      header: 'ID Status',
    },
    {
      accessorKey: 'orig_entry',
      header: 'Additional Information',
    },
    {
      accessorKey: 'source_name',
      header: 'Source Name',
    },
    {
      accessorKey: 'nis',
      header: 'NIS',
    },
    {
      accessorKey: 'pct',
      header: 'PCT',
    },
    {
      accessorKey: 'quad',
      header: 'QUAD',
    },
    {
      accessorKey: 'mni',
      header: 'MNI',
    },
    {
      accessorKey: 'qua',
      header: 'QUA',
    },
    {
      accessorKey: 'body_mass',
      header: 'Body Mass (g)',
    },
    {
      accessorKey: 'mesowear',
      header: 'Mesowear',
    },
    {
      accessorKey: 'mw_or_low',
      header: 'MW Low',
    },
    {
      accessorKey: 'mw_or_high',
      header: 'MW High',
    },
    {
      accessorKey: 'mw_cs_sharp',
      header: 'MW Sharp',
    },
    {
      accessorKey: 'mw_cs_round',
      header: 'MW Round',
    },
    {
      accessorKey: 'mw_cs_blunt',
      header: 'MW Blunt',
    },
    {
      accessorKey: 'mw_scale_min',
      header: 'MW Scale Min',
    },
    {
      accessorKey: 'mw_scale_max',
      header: 'MW Scale Max',
    },
    {
      accessorKey: 'mw_value',
      header: 'MW Value',
    },
    {
      header: 'MW Score',
      Cell: ({ row }: { row: MRT_Row<LocalitySpecies> }) => {
        if (!hasMesowearScoreInputs(row.original)) {
          return <Box />
        }

        const score = calculateNormalizedMesowearScore(
          row.original.mw_scale_min,
          row.original.mw_scale_max,
          row.original.mw_value
        )

        return <Box>{score ?? ''}</Box>
      },
    },
    {
      accessorKey: 'microwear',
      header: 'Microwear',
    },
    {
      accessorKey: 'dc13_mean',
      header: 'dC13 Mean',
    },
    {
      accessorKey: 'dc13_n',
      header: 'dC13 n',
    },
    {
      accessorKey: 'dc13_max',
      header: 'dC13 Max',
    },
    {
      accessorKey: 'dc13_min',
      header: 'dC13 Min',
    },
    {
      accessorKey: 'dc13_stdev',
      header: 'dC13 STDEV',
    },
    {
      accessorKey: 'do18_mean',
      header: 'dO18 Mean',
    },
    {
      accessorKey: 'do18_n',
      header: 'dO18 n',
    },
    {
      accessorKey: 'do18_max',
      header: 'dO18 Max',
    },
    {
      accessorKey: 'do18_min',
      header: 'dO18 Min',
    },
    {
      accessorKey: 'do18_stdev',
      header: 'dO18 STDEV',
    },
  ]

  const getExportLocalities = <T extends MRT_RowData>(table: MRT_TableInstance<T>) => {
    const rows = table.getPrePaginationRowModel().rows.map(row => row.original as unknown as LocalitySpecies)
    return getUniqueLocalityOccurrenceMapExportLocalities(data, rows)
  }

  const kmlExport = <T extends MRT_RowData>(table: MRT_TableInstance<T>) => {
    exportOccurrenceMapKml(table, 'locality-occurrences', getExportLocalities)
  }

  const svgExport = async <T extends MRT_RowData>(table: MRT_TableInstance<T>) => {
    await exportOccurrenceMapSvg(table, 'locality-occurrences-map', getExportLocalities)
  }

  const textField = (field: keyof EditDataType<OccurrenceDetailsType>, options?: TextFieldOptions) => (
    <EditableTextField<OccurrenceDetailsType> field={field} {...options} />
  )

  const dropdown = (
    field: keyof EditDataType<OccurrenceDetailsType>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean
  ) => <DropdownSelector<OccurrenceDetailsType> field={field} options={options} name={name} disabled={disabled} />

  const dropdownWithSearch = (
    field: keyof EditDataType<OccurrenceDetailsType>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean,
    label?: string
  ) => (
    <DropdownSelectorWithSearch<OccurrenceDetailsType>
      field={field}
      options={options}
      name={name}
      disabled={disabled}
      label={label}
    />
  )

  const radioSelection = (
    field: keyof EditDataType<OccurrenceDetailsType>,
    options: Array<DropdownOption | string>,
    name: string,
    optionalRadioSelectionProps?: OptionalRadioSelectionProps
  ) => (
    <RadioSelector<OccurrenceDetailsType>
      field={field}
      options={options}
      name={name}
      {...optionalRadioSelectionProps}
    />
  )

  const bigTextField = (field: keyof EditDataType<OccurrenceDetailsType>) => (
    <EditableTextField<OccurrenceDetailsType> field={field} type="text" big />
  )

  const newOccurrenceContextData = useMemo<OccurrenceDetailsType>(
    () => ({
      ...emptyOccurrence,
      lid: editData.lid ?? 0,
      loc_name: editData.loc_name ?? '',
    }),
    [editData.lid, editData.loc_name]
  )

  const onSave = (
    occurrenceSpesificFields: EditDataType<OccurrenceDetailsType>,
    comSpecies: EditDataType<SpeciesDetailsType>
  ) => {
    const appendedOccurrence = {
      ...occurrenceSpesificFields,
      lid: editData.lid,
      species_id: comSpecies.species_id,
      com_species: comSpecies,
      rowState: 'new',
    } as unknown as LocalitySpeciesDetailsType
    setEditData({
      ...editData,
      now_ls: [...editData.now_ls, appendedOccurrence],
    })
  }

  return (
    <Grouped title={occurrenceLabels.informationSectionTitle}>
      <Box>
        {!mode.read && (
          <EditingModal showCloseButton={false} buttonText="Open occurrence creation view">
            {({ close }) => (
              <DetailContextProvider<OccurrenceDetailsType>
                contextState={{
                  data: newOccurrenceContextData,
                  mode: modeOptionToMode.new,
                  setMode: () => undefined,
                  editData: newOccurrenceContextData as EditDataType<OccurrenceDetailsType>,
                  textField,
                  dropdown,
                  dropdownWithSearch,
                  radioSelection,
                  bigTextField,
                  validator: validateOccurrence,
                  validateFields: validateOccurrenceFields,
                  fieldsWithErrors,
                  setFieldsWithErrors,
                }}
              >
                <NewOccurrenceDialogContent
                  localityData={editData}
                  onClose={close}
                  onSave={onSave}
                  validateOccurrenceFields={validateOccurrenceFields}
                />
              </DetailContextProvider>
            )}
          </EditingModal>
        )}
      </Box>

      <EditableTable<Editable<LocalitySpecies>, LocalityDetailsType>
        columns={columns}
        field="now_ls"
        visible_data={sortedOccurrenceRows}
        enableAdvancedTableControls={true}
        idFieldName="species_id"
        url="occurrence"
        getDetailPath={row => `/occurrence/${row.lid}/${row.species_id}`}
        kmlExport={kmlExport}
        svgExport={svgExport}
        renderReadRowActions={({ row }) => (
          <>
            <Tooltip title={`See details for species ${row.original.species_id}`}>
              <Link to={`/species/${row.original.species_id}`}>{<ManageSearchIcon />}</Link>
            </Tooltip>
            <EntryUpdateHistory
              row={row.original}
              label={`occurrence ${row.original.lid}/${row.original.species_id}`}
              tableName="now_ls"
              getRowValue={occurrence => occurrence.species_id}
              getPkValues={occurrence => [occurrence.lid, occurrence.species_id]}
            />
          </>
        )}
      />
    </Grouped>
  )
}
