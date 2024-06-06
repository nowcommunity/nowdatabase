import { RegionDetails, RegionCoordinator, RegionCountry } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'

export const CoordinatorTab = () => {
  const { editData } = useDetailContext<RegionDetails>()
  const coordinator: MRT_ColumnDef<RegionCoordinator>[] = [
    {
      accessorKey: 'com_people.surname',
      header: 'Surname',
    },
    {
      accessorKey: 'com_people.first_name',
      header: 'First name',
    },
    {
      accessorKey: 'com_people.organization',
      header: 'Organization',
    },
  ]

  const country: MRT_ColumnDef<RegionCountry>[] = [
    {
      accessorKey: 'country',
      header: 'Country',
    },
  ]

  // TODO: Selecting existing User or Country
  return (
    <>
      <Grouped title="Regional Coordinators">
        <EditableTable<RegionCoordinator, RegionDetails>
          columns={coordinator}
          editTableData={editData.now_reg_coord_people}
          field="now_reg_coord_people"
        />
      </Grouped>
      <Grouped title="Countries">
        <EditableTable<RegionCountry, RegionDetails>
          columns={country}
          editTableData={editData.now_reg_coord_country}
          field="now_reg_coord_country"
        />
      </Grouped>
    </>
  )
}
