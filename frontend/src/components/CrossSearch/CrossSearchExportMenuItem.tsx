import { useState } from 'react'
import { useNotify } from '@/hooks/notification'
import { BACKEND_URL } from '@/util/config'
import { MenuItem } from '@mui/material'
import { useUser } from '@/hooks/user'
import { usePageContext } from '../Page'
import { currentDateAsString } from '@/shared/currentDateAsString'
import { downloadExportFileWithProgress } from '@/util/exportProgress'

export const CrossSearchExportMenuItem = ({ handleClose }: { handleClose: () => void }) => {
  const [loading, setLoading] = useState(false)
  const { sqlColumnFilters, sqlOrderBy } = usePageContext()
  const { notify, setMessage: setNotificationMessage } = useNotify()

  const token = useUser().token
  const fetchOptions = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

  const filename = `locality-species-${currentDateAsString()}.csv`

  const fetchCSVFile = async () => {
    setLoading(true)

    try {
      await downloadExportFileWithProgress({
        url: `${BACKEND_URL}/crosssearch/export`,
        filename,
        fetchOptions: {
          ...fetchOptions,
          method: 'POST',
          headers: {
            ...fetchOptions.headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ columnFilters: sqlColumnFilters, sorting: sqlOrderBy }),
        },
        notify,
        setNotificationMessage,
        startMessage: 'Generating cross-search CSV export...',
        waitingMessage: 'Waiting for cross-search rows',
        downloadMessage: 'Downloading CSV file',
        failureMessage: 'Downloading cross-search export failed.',
        contentType: 'text/csv',
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
        void fetchCSVFile()
        handleClose()
      }}
      disabled={loading}
    >
      Export table
    </MenuItem>
  )
}
