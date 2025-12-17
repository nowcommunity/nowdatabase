import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

type UnsavedChangesDialogProps = {
  open: boolean
  title?: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export const UnsavedChangesDialog = ({
  open,
  title = 'Unsaved changes',
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Leave page',
  cancelLabel = 'Stay on page',
}: UnsavedChangesDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="unsaved-changes-dialog-title"
      aria-describedby="unsaved-changes-dialog-description"
    >
      {title ? <DialogTitle id="unsaved-changes-dialog-title">{title}</DialogTitle> : null}
      <DialogContent>
        <DialogContentText id="unsaved-changes-dialog-description">{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" color="primary">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
