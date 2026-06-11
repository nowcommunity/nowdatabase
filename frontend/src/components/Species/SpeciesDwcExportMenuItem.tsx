import { useState } from 'react'
import { MenuItem } from '@mui/material'
import { useNotify } from '@/hooks/notification'
import { BACKEND_URL } from '@/util/config'
import { useUser } from '@/hooks/user'
import { Role } from '@/shared/types'
import { currentDateAsString } from '@/shared/currentDateAsString'
import { downloadExportFileWithProgress } from '@/util/exportProgress'
import { usePageContext } from '../Page'

export const SpeciesDwcExportMenuItem = ({ handleClose }: { handleClose: () => void }) => {
  const [loading, setLoading] = useState(false)
  const { notify, setMessage: setNotificationMessage } = useNotify()
  const user = useUser()
  const { idList } = usePageContext()

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
    body: JSON.stringify({ ids: idList }),
  }
  const filename = `now_dwc_export_${currentDateAsString()}.zip`

  const fetchZipFile = async () => {
    setLoading(true)

    try {
      await downloadExportFileWithProgress({
        url: `${BACKEND_URL}/species/export/dwc-archive`,
        filename,
        fetchOptions: filteredFetchOptions,
        notify,
        setNotificationMessage,
        startMessage: 'Generating DwC-A taxon ZIP export...',
        waitingMessage: 'Waiting for taxon export rows',
        downloadMessage: 'Downloading DwC-A taxon ZIP',
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
      Export DwC-A (taxa + measurements)
    </MenuItem>
  )
}
