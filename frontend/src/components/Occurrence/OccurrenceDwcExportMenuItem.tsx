import { useState } from 'react'
import { MenuItem } from '@mui/material'
import { useNotify } from '@/hooks/notification'
import { BACKEND_URL } from '@/util/config'
import { useUser } from '@/hooks/user'
import { Role } from '@/shared/types'
import { currentDateAsString } from '@/shared/currentDateAsString'
import { createExportId, downloadExportFileWithProgress } from '@/util/exportProgress'
import { usePageContext } from '../Page'

export const OccurrenceDwcExportMenuItem = ({ handleClose }: { handleClose: () => void }) => {
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
  const filename = `now_dwc_occurrences_export_${currentDateAsString()}.zip`

  const fetchZipFile = async () => {
    setLoading(true)
    const exportId = createExportId()
    try {
      await downloadExportFileWithProgress({
        url: `${BACKEND_URL}/occurrence/export/dwc-archive?${new URLSearchParams({ exportId })}`,
        progressUrl: `${BACKEND_URL}/occurrence/export/dwc-archive/progress/${exportId}`,
        filename,
        fetchOptions: filteredFetchOptions,
        progressFetchOptions: fetchOptions,
        notify,
        setNotificationMessage,
        startMessage: 'Generating DwC-A occurrence ZIP export...',
        waitingMessage: 'Waiting for occurrence export rows',
        downloadMessage: 'Downloading DwC-A occurrence ZIP',
        failureMessage: 'Downloading DwC-A export failed.',
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
      Export DwC-A (occurrences)
    </MenuItem>
  )
}
