import { useState } from 'react'
import { MenuItem } from '@mui/material'
import { useNotify } from '@/hooks/notification'
import { BACKEND_URL } from '@/util/config'
import { useUser } from '@/hooks/user'
import { Role } from '@/shared/types'
import { currentDateAsString } from '@/shared/currentDateAsString'
import { downloadExportFileWithProgress } from '@/util/exportProgress'
import { usePageContext } from '../Page'

export const OccurrenceDwcDpExportMenuItem = ({ handleClose }: { handleClose: () => void }) => {
  const [loading, setLoading] = useState(false)
  const { notify, setMessage: setNotificationMessage } = useNotify()
  const user = useUser()
  const { sqlColumnFilters, sqlOrderBy } = usePageContext()

  if (user.role !== Role.Admin) {
    return null
  }

  const fetchOptions: RequestInit = user.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {}
  const filteredFetchOptions: RequestInit = {
    ...fetchOptions,
    method: 'POST',
    headers: {
      ...(fetchOptions.headers as Record<string, string> | undefined),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ columnFilters: sqlColumnFilters, sorting: sqlOrderBy }),
  }
  const filename = `now_dwc_dp_export_${currentDateAsString()}.zip`

  const fetchZipFile = async () => {
    setLoading(true)

    try {
      await downloadExportFileWithProgress({
        url: `${BACKEND_URL}/occurrence/export/dwc-data-package`,
        filename,
        fetchOptions: filteredFetchOptions,
        notify,
        setNotificationMessage,
        startMessage: 'Generating DwC-DP ZIP export...',
        waitingMessage: 'Waiting for DwC-DP event and occurrence rows',
        downloadMessage: 'Downloading DwC-DP ZIP',
        failureMessage: 'Downloading DwC-DP export failed.',
        contentType: 'application/zip',
      })
    } catch {
      // downloadExportFileWithProgress owns the failure notification.
    } finally {
      setLoading(false)
    }
  }

  return (
    <MenuItem
      onClick={() => {
        void fetchZipFile()
        handleClose()
      }}
      disabled={loading}
    >
      Export DwC-DP (events + occurrences)
    </MenuItem>
  )
}
