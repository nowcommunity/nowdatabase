import { Editable, RegionDetails, RegionCoordinator, RegionCountry, EditDataType } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'

export const CoordinatorTab = () => {
  const { editData } = useDetailContext<RegionDetails>()
  const coordinator: MRT_ColumnDef<EditDataType<Editable<RegionCoordinator>>>[] = [
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

  const country: MRT_ColumnDef<EditDataType<Editable<RegionCountry>>>[] = [
    {
      accessorKey: 'country',
      header: 'Country',
    },
  ]

  // TODO: Selecting existing User or Country
  return (
    <>
      <Grouped title="Regional Coordinators">
        <EditableTable<EditDataType<Editable<RegionCoordinator>>, RegionDetails>
          columns={coordinator}
          editTableData={editData.now_reg_coord_people}
          field="now_reg_coord_people"
        />
      </Grouped>
      <Grouped title="Countries">
        <EditableTable<EditDataType<Editable<RegionCountry>>, RegionDetails>
          columns={country}
          editTableData={editData.now_reg_coord_country}
          field="now_reg_coord_country"
        />
      </Grouped>
    </>
  )
}
