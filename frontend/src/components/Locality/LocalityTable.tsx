import { useCallback, useEffect, useMemo, useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/query'
import { MRT_TableInstance, type MRT_ColumnDef, MRT_RowData } from 'material-react-table'
import { useGetAllLocalitiesQuery } from '../../redux/localityReducer'
import { Locality, SimplifiedLocality } from '@/shared/types'
import { TableView } from '../TableView/TableView'
import type { ColumnVisibilityGroup } from '../TableView/TableToolBar'
import { generateKml } from '@/util/kml'
import { formatWithMaxThreeDecimals } from '@/util/numberFormatting'
import { usePageContext } from '../Page'
import { LocalitySynonymsModal } from './LocalitySynonymsModal'
import { currentDateAsString } from '@/shared/currentDateAsString'
import { matchesCountryOrContinent } from '@/shared/validators/countryContinents'
import { LocalityDwcExportMenuItem } from './LocalityDwcExportMenuItem'
import { LazyLocalitiesMap } from '../Map/LazyLocalitiesMap'
import { LOCALITY_LIST_OPTIONAL_FIELDS } from '@/shared/localityListFields'

export const LocalityTable = ({ selectorFn }: { selectorFn?: (newObject: Locality) => void }) => {
  const [selectedLocality, setSelectedLocality] = useState<string | undefined>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  // Optional columns requested from the backend. Only grows, so hiding a column does not trigger a refetch.
  const [requestedFields, setRequestedFields] = useState<string[] | null>(null)
  const {
    data: localitiesQueryData,
    isFetching: localitiesQueryIsFetching,
    isError: localitiesQueryIsError,
    error: localitiesQueryError,
  } = useGetAllLocalitiesQuery(requestedFields ?? skipToken)
  const [filteredLocalities, setFilteredLocalities] = useState<SimplifiedLocality[]>()
  const columnFilters = usePageContext()

  const handleColumnVisibilityChange = useCallback((visibility: Record<string, boolean>) => {
    // Columns missing from the visibility state are visible.
    const needed = LOCALITY_LIST_OPTIONAL_FIELDS.filter(columnId => visibility[columnId] !== false)
    setRequestedFields(previous => {
      const merged = [...new Set([...(previous ?? []), ...needed])].sort()
      return previous && merged.length === previous.length ? previous : merged
    })
  }, [])

  const handleLocalityRowActionClick = (row: Locality) => {
    setSelectedLocality(row.lid.toString())
    setModalOpen(true)
  }

  useEffect(() => {
    // Filter localities for the map component
    const localityIds = columnFilters.idList as unknown as number[]
    const validIds = localityIds.filter(id => typeof id === 'number')

    if (validIds.length > 0) {
      const validIdSet = new Set(validIds)
      setFilteredLocalities(localitiesQueryData?.filter(locality => validIdSet.has(locality.lid)))
    } else setFilteredLocalities(localitiesQueryData as SimplifiedLocality[])
  }, [columnFilters, localitiesQueryData])

  const columns = useMemo<MRT_ColumnDef<Locality>[]>(
    () => [
      {
        accessorKey: 'lid',
        header: 'Locality Id',
        size: 20,
        enableColumnFilterModes: false,
      },
      {
        id: 'loc_name',
        accessorFn: row => row.loc_name || '',
        header: 'Name',
        enableHiding: false,
        filterFn: (row, columnId, filterValue) => {
          const search =
            typeof filterValue === 'string'
              ? filterValue.trim().toLowerCase()
              : Array.isArray(filterValue)
                ? filterValue.join(' ').trim().toLowerCase()
                : ''
          if (!search) return true

          const nameValue = `${row.getValue<string>(columnId) ?? ''}`.toLowerCase()
          if (nameValue.includes(search)) return true

          return (row.original.synonyms ?? []).some(synonym => synonym.toLowerCase().includes(search))
        },
      },
      {
        accessorKey: 'dms_lat',
        header: 'DMS lat',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'dms_long',
        header: 'DMS long',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'dec_lat',
        header: 'Dec lat',
        filterVariant: 'range',
        enableColumnFilterModes: false,
        Cell: ({ cell }) => formatWithMaxThreeDecimals(cell.getValue() as number),
      },
      {
        accessorKey: 'dec_long',
        header: 'Dec long',
        filterVariant: 'range',
        enableColumnFilterModes: false,
        Cell: ({ cell }) => formatWithMaxThreeDecimals(cell.getValue() as number),
      },
      {
        accessorKey: 'altitude',
        header: 'Altitude',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'max_age',
        header: 'Max age',
        filterVariant: 'range',
        enableColumnFilterModes: false,
        Cell: ({ cell }) => formatWithMaxThreeDecimals(cell.getValue() as number),
      },
      {
        id: 'bfa_max',
        accessorFn: row => row.bfa_max || '',
        header: 'BFA max',
        filterFn: 'contains',
      },
      {
        id: 'bfa_max_abs',
        accessorFn: row => row.bfa_max_abs || '',
        header: 'BFA max abs',
        filterFn: 'contains',
      },
      {
        accessorKey: 'frac_max',
        header: 'Frac max',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
        filterVariant: 'range',
        enableColumnFilterModes: false,
        Cell: ({ cell }) => formatWithMaxThreeDecimals(cell.getValue() as number),
      },
      {
        id: 'bfa_min',
        accessorFn: row => row.bfa_min || '',
        header: 'BFA min',
        filterFn: 'contains',
      },
      {
        id: 'bfa_min_abs',
        accessorFn: row => row.bfa_min_abs || '',
        header: 'BFA min abs',
        filterFn: 'contains',
      },
      {
        accessorKey: 'frac_min',
        header: 'Frac min',
        enableColumnFilterModes: false,
      },
      {
        id: 'chron',
        accessorFn: row => row.chron || '',
        header: 'Chron',
        filterFn: 'contains',
      },
      {
        id: 'age_comm',
        accessorFn: row => row.age_comm || '',
        header: 'Age Comment',
        filterFn: 'contains',
      },
      {
        id: 'basin',
        accessorFn: row => row.basin || '',
        header: 'Basin',
        filterFn: 'contains',
      },
      {
        id: 'subbasin',
        accessorFn: row => row.subbasin || '',
        header: 'Subbasin',
        filterFn: 'contains',
      },
      {
        id: 'country',
        accessorFn: row => row.country || '',
        header: 'Country or Continent',
        enableHiding: false,
        enableColumnFilterModes: false,
        filterFn: (row, columnId, filterValue) => {
          const search =
            typeof filterValue === 'string' ? filterValue : Array.isArray(filterValue) ? filterValue.join(' ') : ''

          return matchesCountryOrContinent(row.getValue<string>(columnId), search)
        },
      },
      {
        id: 'state',
        accessorFn: row => row.state || '',
        header: 'State',
        filterFn: 'contains',
      },
      {
        id: 'county',
        accessorFn: row => row.county || '',
        header: 'County',
        filterFn: 'contains',
      },
      {
        accessorKey: 'appr_num_spm',
        header: 'Approx. Number of Specimens',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'gen_loc',
        header: 'Gen locality',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'site_area',
        header: 'Site area',
        enableColumnFilterModes: false,
        filterFn: 'contains',
      },
      {
        id: 'plate',
        accessorFn: row => row.plate || '',
        header: 'Plate',
        filterFn: 'contains',
      },
      {
        id: 'formation',
        accessorFn: row => row.formation || '',
        header: 'Formation',
        filterFn: 'contains',
      },
      {
        id: 'member',
        accessorFn: row => row.member || '',
        header: 'Member',
        filterFn: 'contains',
      },
      {
        id: 'bed',
        accessorFn: row => row.bed || '',
        header: 'Bed',
        filterFn: 'contains',
      },
      {
        accessorKey: 'estimate_precip',
        header: 'Estimate of annual precipitation (mm)',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'estimate_temp',
        header: 'Estimate MAT',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'estimate_npp',
        header: 'Estimate NPP',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'pers_woody_cover',
        header: 'Woody cover percentage',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'pers_pollen_ap',
        header: 'Arboreal pollen percentage',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'pers_pollen_nap',
        header: 'Non-arboreal pollen percentage',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'pers_pollen_other',
        header: 'Other pollen percentage',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'hominin_skeletal_remains',
        header: 'Hominin skeletal remains',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'bipedal_footprints',
        header: 'Bipedal footprints',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'stone_tool_cut_marks_on_bones',
        header: 'Stone tool cut marks on bones',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'stone_tool_technology',
        header: 'Stone tool technology',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'technological_mode_1',
        header: 'Technological mode 1',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'technological_mode_2',
        header: 'Technological mode 2',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'technological_mode_3',
        header: 'Technological mode 3',
        enableColumnFilterModes: false,
      },
      {
        id: 'cultural_stage_1',
        accessorFn: row => row.cultural_stage_1 || '',
        header: 'Cultural stage 1',
        filterFn: 'contains',
      },
      {
        id: 'cultural_stage_2',
        accessorFn: row => row.cultural_stage_2 || '',
        header: 'Cultural stage 2',
        filterFn: 'contains',
      },
      {
        id: 'cultural_stage_3',
        accessorFn: row => row.cultural_stage_3 || '',
        header: 'Cultural stage 3',
        filterFn: 'contains',
      },
      {
        id: 'regional_culture_1',
        accessorFn: row => row.regional_culture_1 || '',
        header: 'Regional culture 1',
        filterFn: 'contains',
      },
      {
        id: 'regional_culture_2',
        accessorFn: row => row.regional_culture_2 || '',
        header: 'Regional culture 2',
        filterFn: 'contains',
      },
      {
        id: 'regional_culture_3',
        accessorFn: row => row.regional_culture_3 || '',
        header: 'Regional culture 3',
        filterFn: 'contains',
      },
    ],
    []
  )

  const visibleColumns = {
    lid: false,
    bfa_max: false,
    bfa_min: false,
    bfa_max_abs: false,
    bfa_min_abs: false,
    frac_max: false,
    frac_min: false,
    chron: false,
    age_comm: false,
    basin: false,
    subbasin: false,
    dms_lat: false,
    dms_long: false,
    dec_lat: false,
    dec_long: false,
    altitude: false,
    state: false,
    county: false,
    site_area: false,
    gen_loc: false,
    plate: false,
    formation: false,
    member: false,
    bed: false,
    appr_num_spm: false,
    estimate_precip: false,
    estimate_temp: false,
    estimate_npp: false,
    pers_woody_cover: false,
    pers_pollen_ap: false,
    pers_pollen_nap: false,
    pers_pollen_other: false,
    hominin_skeletal_remains: false,
    bipedal_footprints: false,
    stone_tool_cut_marks_on_bones: false,
    stone_tool_technology: false,
    technological_mode_1: false,
    technological_mode_2: false,
    technological_mode_3: false,
    cultural_stage_1: false,
    cultural_stage_2: false,
    cultural_stage_3: false,
    regional_culture_1: false,
    regional_culture_2: false,
    regional_culture_3: false,
  }

  const columnVisibilityGroups = useMemo<ColumnVisibilityGroup[]>(
    () => [
      {
        id: 'age',
        label: 'Age',
        columnIds: [
          'max_age',
          'min_age',
          'bfa_max',
          'bfa_min',
          'bfa_max_abs',
          'bfa_min_abs',
          'frac_max',
          'frac_min',
          'chron',
          'age_comm',
          'basin',
          'subbasin',
          'formation',
          'member',
          'bed',
        ],
      },
      {
        id: 'locality',
        label: 'Locality',
        columnIds: [
          'lid',
          'loc_name',
          'country',
          'state',
          'county',
          'dms_lat',
          'dms_long',
          'dec_lat',
          'dec_long',
          'altitude',
          'appr_num_spm',
          'gen_loc',
          'site_area',
          'plate',
        ],
      },
      {
        id: 'ecometrics',
        label: 'Ecometrics',
        columnIds: ['estimate_precip', 'estimate_temp', 'estimate_npp', 'pers_woody_cover'],
      },
      {
        id: 'climate',
        label: 'Climate',
        columnIds: ['pers_pollen_ap', 'pers_pollen_nap', 'pers_pollen_other'],
      },
      {
        id: 'archaeology',
        label: 'Archaeology',
        columnIds: [
          'hominin_skeletal_remains',
          'bipedal_footprints',
          'stone_tool_cut_marks_on_bones',
          'stone_tool_technology',
          'technological_mode_1',
          'technological_mode_2',
          'technological_mode_3',
          'cultural_stage_1',
          'cultural_stage_2',
          'cultural_stage_3',
          'regional_culture_1',
          'regional_culture_2',
          'regional_culture_3',
        ],
      },
    ],
    []
  )

  // Downloads a KML file of filtered localities.
  const kmlExport = <T extends MRT_RowData>(table: MRT_TableInstance<T>) => {
    const rowData: Locality[] = table.getPrePaginationRowModel().rows.map(row => row.original as unknown as Locality)

    const dataString = generateKml(rowData)
    const blob = new Blob([dataString], { type: 'text/kml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `localities-${currentDateAsString()}.kml`
    a.click()
  }

  const svgExport = async <T extends MRT_RowData>(table: MRT_TableInstance<T>) => {
    const rowData: Locality[] = table.getPrePaginationRowModel().rows.map(row => row.original as unknown as Locality)
    const { generateSvg } = await import('../Map/generateSvg')
    const dataString = generateSvg(rowData)
    const blob = new Blob([dataString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `localities-map-${currentDateAsString()}.svg`
    a.click()
  }

  const checkRowRestriction = (row: Locality) => {
    return !!row.loc_status
  }

  return (
    <>
      <LazyLocalitiesMap localities={filteredLocalities} isFetching={localitiesQueryIsFetching} />
      <TableView<Locality>
        title="Localities"
        selectorFn={selectorFn}
        checkRowRestriction={checkRowRestriction}
        idFieldName="lid"
        defaultSorting={[{ id: 'loc_name', desc: false }]}
        columns={columns}
        isFetching={localitiesQueryIsFetching || requestedFields === null}
        isError={localitiesQueryIsError}
        error={localitiesQueryError}
        visibleColumns={visibleColumns}
        columnVisibilityGroups={columnVisibilityGroups}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        data={localitiesQueryData}
        url="locality"
        kmlExport={kmlExport}
        svgExport={svgExport}
        renderExtraExportMenuItems={[
          (handleClose, key) => <LocalityDwcExportMenuItem handleClose={handleClose} key={key} />,
        ]}
        enableColumnFilterModes={true}
        tableRowAction={handleLocalityRowActionClick}
      />
      <LocalitySynonymsModal open={modalOpen} onClose={() => setModalOpen(false)} selectedLocality={selectedLocality} />
    </>
  )
}
