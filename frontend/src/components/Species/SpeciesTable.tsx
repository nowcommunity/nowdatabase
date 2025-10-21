import { useMemo, useState } from 'react'
import { type MRT_ColumnDef, type MRT_FilterFn } from 'material-react-table'
import { useGetAllSpeciesQuery } from '../../redux/speciesReducer'
import { Species } from '@/shared/types'
import { TableView } from '../TableView/TableView'
import { SynonymsModal } from './SynonymsModal'

const normalizeFilterValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.toLowerCase().trim()
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString().toLowerCase().trim()
  }

  if (value instanceof Date) {
    return value.toISOString().toLowerCase().trim()
  }

  return ''
}

const createSynonymAwareFilter = (
  primaryKey: 'genus_name' | 'species_name',
  synonymKey: 'syn_genus_name' | 'syn_species_name'
): MRT_FilterFn<Species> => {
  return (row, _columnId, filterValue) => {
    const normalizedFilter = normalizeFilterValue(filterValue)
    if (!normalizedFilter) {
      return true
    }

    const primaryValue = row.original[primaryKey]?.toLowerCase() ?? ''
    if (primaryValue.includes(normalizedFilter)) {
      return true
    }

    return (row.original.synonyms ?? []).some(synonym => {
      const synonymValue = synonym[synonymKey]?.toLowerCase()
      return synonymValue ? synonymValue.includes(normalizedFilter) : false
    })
  }
}

export const SpeciesTable = ({ selectorFn }: { selectorFn?: (id: Species) => void }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { data: speciesQueryData, isFetching } = useGetAllSpeciesQuery()

  const synonymFilterFns = useMemo<Record<string, MRT_FilterFn<Species>>>(
    () => ({
      genusSynonymContains: createSynonymAwareFilter('genus_name', 'syn_genus_name'),
      speciesSynonymContains: createSynonymAwareFilter('species_name', 'syn_species_name'),
    }),
    []
  )

  const handleSpeciesRowActionClick = (row: Species) => {
    setSelectedSpecies(row.species_id.toString())
    setModalOpen(true)
  }

  const columns = useMemo<MRT_ColumnDef<Species>[]>(
    () => [
      {
        accessorKey: 'species_id',
        header: 'Id',
        size: 20,
        enableColumnFilterModes: false,
      },
      {
        id: 'subclass_or_superorder_name',
        accessorFn: row => row.subclass_or_superorder_name || '',
        header: 'Subclass or Superorder',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'order_name',
        accessorFn: row => row.order_name || '',
        header: 'Order',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'suborder_or_superfamily_name',
        accessorFn: row => row.suborder_or_superfamily_name || '',
        header: 'Suborder or Superfamily',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'family_name',
        accessorFn: row => row.family_name || '',
        header: 'Family',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'subfamily_name',
        accessorFn: row => row.subfamily_name || '',
        header: 'Subfamily or Tribe',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'genus_name',
        accessorFn: row => row.genus_name || '',
        header: 'Genus',
        size: 20,
        enableHiding: false,
        filterFn: 'genusSynonymContains',
        enableColumnFilterModes: false,
      },
      {
        id: 'species_name',
        accessorFn: row => row.species_name || '',
        header: 'Species',
        size: 20,
        enableHiding: false,
        filterFn: 'speciesSynonymContains',
        enableColumnFilterModes: false,
      },
      {
        id: 'unique_identifier',
        accessorFn: row => row.unique_identifier || '',
        header: 'Unique Identifier',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'taxonomic_status',
        accessorFn: row => row.taxonomic_status || '',
        header: 'Taxonomic Status',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'sv_length',
        accessorFn: row => row.sv_length || '',
        header: 'Snout-Vent Length',
        size: 10,
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'body_mass',
        accessorFn: row => row.body_mass || '',
        header: 'Body Mass',
        size: 10,
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'sd_size',
        accessorFn: row => row.sd_size || '',
        header: 'Sexual Dimorphism - Size',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'sd_display',
        accessorFn: row => row.sd_display || '',
        header: 'Sexual Dimorphism - Display',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'tshm',
        accessorFn: row => row.tshm || '',
        header: 'Tooth Shape - Multicuspid',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'tht',
        accessorFn: row => row.tht || '',
        header: 'Hypsodonty',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'horizodonty',
        accessorFn: row => row.horizodonty || '',
        header: 'Horizodonty',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'crowntype',
        accessorFn: row => row.crowntype || '',
        header: 'Crown Type',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'crowntype',
        accessorFn: row => row.crowntype || '',
        header: 'Developmental Crown Type',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'cusp_shape',
        accessorFn: row => row.cusp_shape || '',
        header: 'Cusp shape',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'cusp_count_buccal',
        accessorFn: row => row.cusp_count_buccal || '',
        header: 'Buccal cusp count',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'cusp_count_lingual',
        accessorFn: row => row.cusp_count_lingual || '',
        header: 'Lingual cusp count',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'loph_count_lon',
        accessorFn: row => row.loph_count_lon || '',
        header: 'Longitudinal loph count',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'loph_count_trs',
        accessorFn: row => row.loph_count_trs || '',
        header: 'Transverse loph count',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'fct_al',
        accessorFn: row => row.fct_al || '',
        header: 'Presence of acute lophs (AL)',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'fct_ol',
        accessorFn: row => row.fct_ol || '',
        header: 'Presence of obtuse or basin-like lophs (OL)',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'fct_sf',
        accessorFn: row => row.fct_sf || '',
        header: 'Structural fortification of cusps (SF)',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'fct_ot',
        accessorFn: row => row.fct_ot || '',
        header: 'Occlusal topography (OT)',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'fct_cm',
        accessorFn: row => row.fct_cm || '',
        header: 'Coronal cementum (CM)',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'microwear',
        accessorFn: row => row.microwear || '',
        header: 'Microwear',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'mesowear',
        accessorFn: row => row.mesowear || '',
        header: 'Mesowear',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'mw_or_high',
        accessorFn: row => row.mw_or_high || '',
        header: 'Cusp Relief High (OR%)',
        size: 10,
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'mw_or_low',
        accessorFn: row => row.mw_or_low || '',
        header: 'Cusp Relief Low (OR%)',
        size: 10,
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'mw_cs_sharp',
        accessorFn: row => row.mw_cs_sharp || '',
        header: 'Cusp Shape Sharp (CS%)',
        size: 10,
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'mw_cs_round',
        accessorFn: row => row.mw_cs_round || '',
        header: 'Cusp Shape Rounded (CS%)',
        size: 10,
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'mw_cs_blunt',
        accessorFn: row => row.mw_cs_blunt || '',
        header: 'Cusp Shape Blunt (CS%)',
        size: 10,
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'diet1',
        accessorFn: row => row.diet1 || '',
        header: 'Diet 1',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'diet2',
        accessorFn: row => row.diet2 || '',
        header: 'Diet 2',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'diet3',
        accessorFn: row => row.diet3 || '',
        header: 'Diet 3',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'locomo1',
        accessorFn: row => row.locomo1 || '',
        header: 'Locomotion 1',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'locomo2',
        accessorFn: row => row.locomo2 || '',
        header: 'Locomotion 2',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'locomo3',
        accessorFn: row => row.locomo3 || '',
        header: 'Locomotion 3',
        size: 10,
        filterFn: 'contains',
      },
      {
        id: 'sp_comment',
        accessorFn: row => row.sp_comment || '',
        header: 'Comment',
        size: 10,
        filterFn: 'contains',
      },
    ],
    []
  )

  const visibleColumns = {
    species_id: false,
    order_name: true,
    family_name: true,
    genus_name: true,
    species_name: true,
    subclass_or_superorder_name: false,
    suborder_or_superfamily_name: false,
    subfamily_name: false,
    unique_identifier: true,
    taxonomic_status: false,
    sv_length: false,
    body_mass: false,
    sd_size: false,
    sd_display: false,
    tshm: false,
    tht: false,
    horizodonty: false,
    crowntype: false,
    cusp_shape: false,
    cusp_count_buccal: false,
    cusp_count_lingual: false,
    loph_count_lon: false,
    loph_count_trs: false,
    fct_al: false,
    fct_ol: false,
    fct_sf: false,
    fct_ot: false,
    fct_cm: false,
    microwear: false,
    mesowear: false,
    mw_or_high: false,
    mw_or_low: false,
    mw_cs_sharp: false,
    mw_cs_round: false,
    mw_cs_blunt: false,
    diet1: false,
    diet2: false,
    diet3: false,
    locomo1: false,
    locomo2: false,
    locomo3: false,
    sp_comment: false,
  }

  return (
    <>
      <TableView<Species>
        title="Species"
        selectorFn={selectorFn}
        idFieldName="species_id"
        columns={columns}
        isFetching={isFetching}
        visibleColumns={visibleColumns}
        data={speciesQueryData}
        url="species"
        enableColumnFilterModes={true}
        tableRowAction={handleSpeciesRowActionClick}
        filterFns={synonymFilterFns}
      />
      <SynonymsModal open={modalOpen} onClose={() => setModalOpen(false)} selectedSpecies={selectedSpecies} />
    </>
  )
}
