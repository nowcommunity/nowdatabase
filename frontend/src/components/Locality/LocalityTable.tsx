import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllLocalitiesQuery, useGetLocalitySpeciesListMutation } from '../../redux/localityReducer'
import { Locality } from '@/shared/types'
import { TableView } from '../TableView/TableView'
import { useNotify } from '@/hooks/notification'

const decimalCount = (num: number) => {
  const numAsString = num.toString()
  if (numAsString.includes('.')) {
    return numAsString.split('.')[1].length
  }
  return 0
}

export const LocalityTable = ({ selectorFn }: { selectorFn?: (newObject: Locality) => void }) => {
  const { data: localitiesQueryData, isFetching: localitiesQueryIsFetching } = useGetAllLocalitiesQuery()
  const [getLocalitySpeciesList, { isLoading }] = useGetLocalitySpeciesListMutation()
  const notify = useNotify()
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
        filterFn: 'contains',
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
      },
      {
        accessorKey: 'dec_long',
        header: 'Dec long',
        filterVariant: 'range',
        enableColumnFilterModes: false,
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
        Cell: ({ cell }) => {
          const cellVal = cell.getValue() as number
          if (decimalCount(cellVal) > 3) {
            return cellVal.toFixed(3)
          }
          return cellVal
        },
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
        Cell: ({ cell }) => {
          const cellVal = cell.getValue() as number
          if (decimalCount(cellVal) > 3) {
            return cellVal.toFixed(3)
          }
          return cellVal
        },
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
        header: 'Country',
        enableHiding: false,
        enableColumnFilterModes: false,
        filterFn: 'contains',
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

  const combinedExport = async (lids: number[]) => {
    if (isLoading) {
      notify('Please wait for the last request to complete.', 'warning')
      return
    }

    const limit = 99999999
    if (lids.length > limit) {
      notify(`Please filter the table more. Current rows: ${lids.length}. Limit: ${limit}`, 'error')
      return
    }
    const result = await getLocalitySpeciesList(lids).unwrap()
    const dataString = result.map(row => row.join(',')).join('\n')
    const blob = new Blob([dataString], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'localitiesWithSpecies.csv'
    a.click()
  }

  const checkRowRestriction = (row: Locality) => {
    return !!row.loc_status
  }

  return (
    <TableView<Locality>
      title="Localities"
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="lid"
      columns={columns}
      visibleColumns={visibleColumns}
      data={localitiesQueryData}
      url="locality"
      combinedExport={combinedExport}
      exportIsLoading={isLoading}
      enableColumnFilterModes={true}
      isFetching={localitiesQueryIsFetching}
    />
  )
}
