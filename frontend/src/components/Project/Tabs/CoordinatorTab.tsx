import { ProjectDetailsType, ProjectPeople } from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'

export const CoordinatorTab = () => {
  const { editData, radioSelection, textField } = useDetailContext<ProjectDetailsType>()

  const projectInformation = [
    ['Project Id', textField('pid')],
    ['Project Code', textField('proj_code')],
    ['Project Name', textField('proj_name')],
    ['Coordinator', textField('contact')],
    [
      'Project Status',
      radioSelection(
        'proj_status',
        [
          { value: 'current', display: 'Current' },
          { value: 'no_data', display: 'No data' },
          { value: 'finished', display: 'Finished' },
        ],
        'Project Status'
      ),
    ],
    [
      'Record Status',
      radioSelection(
        'proj_records',
        [
          { value: 'false', display: 'Public' },
          { value: 'true', display: 'Private' },
        ],
        'Record Status'
      ),
    ],
  ]

  const people: MRT_ColumnDef<ProjectPeople>[] = [
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

  // TODO: Selecting existing person
  return (
    <>
      <ArrayFrame half array={projectInformation} title="Project Information" />
      <Grouped title="Project Members">
        <EditableTable<ProjectPeople, ProjectDetailsType>
          columns={people}
          editTableData={editData.now_proj_people}
          field="now_proj_people"
        />
      </Grouped>
    </>
  )
}
