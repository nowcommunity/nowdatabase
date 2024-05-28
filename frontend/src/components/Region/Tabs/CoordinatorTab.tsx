import { Editable, RegionDetails, RegionCoordinator, RegionCountry } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/hooks'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'

export const CoordinatorTab = () => {
  const { editData, mode } = useDetailContext<RegionDetails>()
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
        {mode === 'edit'}
        <EditableTable<Editable<RegionCoordinator>, RegionDetails>
          columns={coordinator}
          data={editData.now_reg_coord_people}
          editable
          field="now_reg_coord_people"
        />
      </Grouped>
      <Grouped title="Countries">
        {mode === 'edit'}
        <EditableTable<Editable<RegionCountry>, RegionDetails>
          columns={country}
          data={editData.now_reg_coord_country}
          editable
          field="now_reg_coord_country"
        />
      </Grouped>
    </>
  )
}
