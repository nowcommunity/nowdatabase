import { useState } from 'react'
import { MenuItem } from '@mui/material'
import { useNotify } from '@/hooks/notification'
import { BACKEND_URL } from '@/util/config'
import { useUser } from '@/hooks/user'
import { Role } from '@/shared/types'
import { currentDateAsString } from '@/shared/currentDateAsString'
import { downloadExportFileWithProgress } from '@/util/exportProgress'

export const OccurrenceDwcDpExportMenuItem = ({ handleClose }: { handleClose: () => void }) => {
  const [loading, setLoading] = useState(false)
  const { notify, setMessage: setNotificationMessage } = useNotify()
  const user = useUser()

  if (user.role !== Role.Admin) {
    return null
  }

  const fetchOptions = user.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {}
  const filename = `now_dwc_dp_test_export_${currentDateAsString()}.zip`

  const fetchZipFile = async () => {
    setLoading(true)

    try {
      await downloadExportFileWithProgress({
        url: `${BACKEND_URL}/occurrence/export/dwc-data-package`,
        filename,
        fetchOptions,
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
