import { useState } from 'react'
import { MenuItem } from '@mui/material'
import { useNotify } from '@/hooks/notification'
import { BACKEND_URL } from '@/util/config'
import { useUser } from '@/hooks/user'
import { Role } from '@/shared/types'
import { currentDateAsString } from '@/shared/currentDateAsString'

export const SpeciesDwcExportMenuItem = ({ handleClose }: { handleClose: () => void }) => {
  const [loading, setLoading] = useState(false)
  const { notify, setMessage: setNotificationMessage } = useNotify()
  const user = useUser()

  if (user.role !== Role.Admin) {
    return null
  }

  const fetchOptions = user.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {}
  const filename = `now_dwc_test_export_${currentDateAsString()}.zip`

  const fetchZipFile = async () => {
    setLoading(true)
    notify('Generating DwC-A ZIP export, please wait...', 'info', null)

    try {
      const response = await fetch(`${BACKEND_URL}/species/export/dwc-archive`, fetchOptions)
      if (!response.ok) {
        throw new Error('Server response was not OK.')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Missing response stream.')
      }

      const file: Uint8Array[] = []
      let bytes = 0
      let closed = false

      const showDownloadProgress = () => {
        if (!closed) {
          setTimeout(() => {
            setNotificationMessage(`Downloading DwC-A ZIP, ${Math.round((bytes / 1000000) * 10) / 10} MB`)
            showDownloadProgress()
          }, 500)
        }
      }

      notify('Downloading DwC-A ZIP...', 'info', null)
      showDownloadProgress()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        bytes = bytes + value.length
        file.push(value)
      }
      closed = true

      const blobUrl = window.URL.createObjectURL(new Blob(file, { type: 'application/zip' }))
      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.download = filename
      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.remove()
      window.URL.revokeObjectURL(blobUrl)

      notify('Download finished.')
    } catch {
      notify('Downloading DwC-A export failed.', 'error')
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
