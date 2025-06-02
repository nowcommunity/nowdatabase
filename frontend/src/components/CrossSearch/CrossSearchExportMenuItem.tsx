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
  const notify = useNotify()

  const token = useUser().token
  const fetchOptions = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

  const filename = `cross_search${currentDateAsString()}.csv`

  const fetchCSVFile = () => {
    setLoading(true)
    notify('Downloading CSV file, please wait...', 'info', null)
    const URIColumnFilters = encodeURIComponent(JSON.stringify(sqlColumnFilters))
    const URIOrderBy = encodeURIComponent(JSON.stringify(sqlOrderBy))

    fetch(`${BACKEND_URL}/crosssearch/export/${URIColumnFilters}/${URIOrderBy}`, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Server response was not OK.')
        }
        return response.blob()
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob)
        const downloadLink = document.createElement('a')
        downloadLink.href = blobUrl
        downloadLink.download = filename
        document.body.appendChild(downloadLink)
        downloadLink.click()
        downloadLink.remove()
        window.URL.revokeObjectURL(blobUrl)
        notify('Download finished.')
      })
      .catch(_ => {
        notify('Downloading cross-search export failed.', 'error')
      })
      .finally(() => setLoading(false))
  }
  return (
    <MenuItem
      onClick={() => {
        fetchCSVFile()
        handleClose()
      }}
      disabled={loading}
    >
      Export table
    </MenuItem>
  )
}
