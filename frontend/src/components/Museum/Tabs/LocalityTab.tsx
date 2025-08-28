import { SimpleTable } from '@/components/DetailView/common/SimpleTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { MuseumLocalities } from '@/shared/types'

export const LocalityTab = ({ isNew }: { isNew: boolean }) => {
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

  if (isNew) {
    return (
      <div>
        Link localities to this museum after finalizing it by editing a locality and navigating to the museum tab there.
      </div>
    )
  } else if (data.localities.length === 0) {
    return <div>Link localities to this museum by editing a locality and navigating to the museum tab there.</div>
  }

  return <SimpleTable columns={columns} data={data.localities} idFieldName="lid" url="locality" />
}
