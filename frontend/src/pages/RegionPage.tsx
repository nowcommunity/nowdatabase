import { fullRights, noRights } from '@/components/pages'
import { RegionDetails } from '@/components/Region/RegionDetails'
import { RegionTable } from '@/components/Region/RegionTable'
import { UserState } from '@/redux/userReducer'
import { RegionDetails as RegionDetailsType, Role } from '@/shared/types'

import { Page } from '../components/Page'

export const RegionPage = () => {
  return (
    <Page<RegionDetailsType>
      allowedRoles={[Role.Admin]}
      tableView={<RegionTable />}
      detailView={<RegionDetails />}
      viewName="region"
      idFieldName="reg_coord_id"
      createTitle={(region: RegionDetailsType) => `${region.region}`}
      getEditRights={(user: UserState) => {
        if (user.role === Role.Admin) return fullRights
        return noRights
      }}
    />
  )
}
