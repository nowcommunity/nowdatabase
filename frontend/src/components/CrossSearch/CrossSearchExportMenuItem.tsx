import { useState } from 'react'
import { useNotify } from '@/hooks/notification'
import { BACKEND_URL } from '@/util/config'
import { MenuItem } from '@mui/material'
import { useUser } from '@/hooks/user'
import { usePageContext } from '../Page'
import { currentDateAsString } from '@/shared/currentDateAsString'

export const CrossSearchExportMenuItem = ({ handleClose }: { handleClose: () => void }) => {
  const [loading, setLoading] = useState(false)
  const { sqlColumnFilters, sqlOrderBy } = usePageContext()
  const { notify, setMessage } = useNotify()

  const token = useUser().token
  const fetchOptions = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

  const filename = `cross_search${currentDateAsString()}.csv`

  const fetchCSVFile = async () => {
    setLoading(true)
    const URIColumnFilters = encodeURIComponent(JSON.stringify(sqlColumnFilters))
    const URIOrderBy = encodeURIComponent(JSON.stringify(sqlOrderBy))

    notify('Generating CSV file, please wait...', 'info', null)
    const response = await fetch(`${BACKEND_URL}/crosssearch/export/${URIColumnFilters}/${URIOrderBy}`, fetchOptions)

    if (!response.ok) {
      throw new Error('Server response was not OK.')
    }
    const reader = response.body!.getReader()
    const file: Uint8Array[] = []
    let bytes = 0
    let closed = false

    const showDownloadProgress = () => {
      if (!closed) {
        setTimeout(() => {
          setMessage(`Downloading CSV file, ${Math.round((bytes / 1000000) * 10) / 10} MB`)
          showDownloadProgress()
        }, 500)
      }
    }
    showDownloadProgress()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes = bytes + value.length
      file.push(value)
    }
    closed = true
    try {
      const blobUrl = window.URL.createObjectURL(new Blob(file))
      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.download = filename
      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.remove()
      window.URL.revokeObjectURL(blobUrl)
      notify('Download finished.')
    } catch {
      notify('Downloading cross-search export failed.', 'error')
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
