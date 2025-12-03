import { ProjectDetailsType } from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { CoordinatorSelect } from '../CoordinatorSelect'
import { MembersMultiSelect } from '../MembersMultiSelect'

export const CoordinatorTab = () => {
  const { radioSelection, textField } = useDetailContext<ProjectDetailsType>()

  const projectInformation = [
    ['Project Id', textField('pid')],
    ['Project Code', textField('proj_code')],
    ['Project Name', textField('proj_name')],
    ['Coordinator', <CoordinatorSelect key="coordinator-select" variant="detail" />],
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

  return (
    <>
      <ArrayFrame half array={projectInformation} title="Project Information" />
      <MembersMultiSelect variant="detail" />
    </>
  )
}
