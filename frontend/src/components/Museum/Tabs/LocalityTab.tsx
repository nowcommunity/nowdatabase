import { SimpleTable } from '@/components/DetailView/common/SimpleTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { MuseumLocalities } from '@/shared/types'

export const LocalityTab = () => {
  const { data } = useDetailContext<MuseumLocalities>()

  const columns = [
    {
      accessorKey: 'loc_name',
      header: 'Locality',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
    {
      accessorKey: 'max_age',
      header: 'Max Age',
    },
    {
      accessorKey: 'min_age',
      header: 'Min Age',
    },
  ]
  if (!data) return <div>No localities</div>

  return <SimpleTable columns={columns} data={data.localities} idFieldName="lid" url="locality" />
}
