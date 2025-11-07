import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button } from '@mui/material'

import { useReturnNavigation } from '@/hooks/useReturnNavigation'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const ReturnButton = () => {
  const { mode, setMode } = useDetailContext()
  const { navigateBack } = useReturnNavigation()

  if (mode.staging) {
    return (
      <Button
        id="return-to-editing-button"
        onClick={() => {
          if (mode.new) setMode('new')
          else setMode('edit')
        }}
      >
        <ArrowBackIcon color="primary" style={{ marginRight: '0.2em' }} />
        Return to editing
      </Button>
    )
  }

  return (
    <Button onClick={navigateBack}>
      <ArrowBackIcon color="primary" style={{ marginRight: '0.2em' }} />
      Return to table
    </Button>
  )
}
