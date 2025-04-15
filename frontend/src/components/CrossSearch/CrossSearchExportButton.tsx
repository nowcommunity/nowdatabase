import { useState } from 'react'
import { useNotify } from '@/hooks/notification'
import { BACKEND_URL } from '@/util/config'
import { Box, Button, CircularProgress } from '@mui/material'

export const CrossSearchExportButton = () => {
  const [loading, setLoading] = useState(false)
  const notify = useNotify()

  const fetchCSVFile = () => {
    setLoading(true)
    notify('Download started, please wait...')

    fetch(`${BACKEND_URL}/crosssearch/export`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Server response was not OK.')
        }
        return response.blob()
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'cross_search_export.csv'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      })
      .catch(_ => {
        notify('Downloading cross-search export failed.', 'error')
      })
      .finally(() => setLoading(false))
  }
  return (
    <Box>
      <Button onClick={() => fetchCSVFile()} variant="contained" disabled={loading}>
        Export table
      </Button>
      {loading && <CircularProgress />}
    </Box>
  )
}
