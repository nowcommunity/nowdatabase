import { EditDataType, Editable, ProjectDetailsType, ProjectPeople } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'

export const CoordinatorTab = () => {
  const { data, editData, mode, radioSelection, textField } = useDetailContext<ProjectDetailsType>()

  const getStatusText = () => (data.proj_records ? <>Private</> : <>Public</>)

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
      !mode.read
        ? radioSelection(
            'proj_records',
            [
              { value: 'false', display: 'Public' },
              { value: 'true', display: 'Private' },
            ],
            'Record Status'
          )
        : getStatusText(),
    ],
  ]

  const people: MRT_ColumnDef<EditDataType<Editable<ProjectPeople>>>[] = [
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
        <EditableTable<EditDataType<Editable<ProjectPeople>>, ProjectDetailsType>
          columns={people}
          editTableData={editData.now_proj_people}
          field="now_proj_people"
        />
      </Grouped>
    </>
  )
}
