import { Severity } from '@/components/Notification'

type Notify = (msg: string, severity?: Severity, timeoutValue?: number | null) => void
type ExportProgress = {
  message: string
}

type DownloadExportParams = {
  url: string
  filename: string
  fetchOptions?: RequestInit
  notify: Notify
  setNotificationMessage: (message: string) => void
  startMessage: string
  waitingMessage: string
  downloadMessage: string
  failureMessage: string
  contentType?: string
  progressUrl?: string
}

export const createExportId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const formatMb = (bytes: number) => Math.round((bytes / 1000000) * 10) / 10

export const downloadExportFileWithProgress = async ({
  url,
  filename,
  fetchOptions = {},
  notify,
  setNotificationMessage,
  startMessage,
  waitingMessage,
  downloadMessage,
  failureMessage,
  contentType,
  progressUrl,
}: DownloadExportParams) => {
  let progressTimer: number | undefined
  let waitingSeconds = 0

  const stopProgress = () => {
    if (progressTimer !== undefined) {
      window.clearInterval(progressTimer)
      progressTimer = undefined
    }
  }

  const updateServerProgress = async () => {
    if (!progressUrl) return false

    try {
      const response = await fetch(progressUrl, fetchOptions)
      if (!response.ok) return false

      const progress = (await response.json()) as ExportProgress
      setNotificationMessage(progress.message)
      return true
    } catch {
      return false
    }
  }

  notify(startMessage, 'info', null)

  try {
    progressTimer = window.setInterval(() => {
      waitingSeconds += 1
      void (async () => {
        const hasServerProgress = await updateServerProgress()
        if (!hasServerProgress) {
          setNotificationMessage(`${waitingMessage} (${waitingSeconds}s)`)
        }
      })()
    }, 1000)

    const response = await fetch(url, fetchOptions)
    stopProgress()

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
          setNotificationMessage(`${downloadMessage}, ${formatMb(bytes)} MB`)
          showDownloadProgress()
        }, 500)
      }
    }

    notify(`${downloadMessage}...`, 'info', null)
    showDownloadProgress()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes = bytes + value.length
      file.push(value)
    }
    closed = true
    setNotificationMessage(`Saving ${filename} (${formatMb(bytes)} MB)`)

    const blobUrl = window.URL.createObjectURL(new Blob(file, contentType ? { type: contentType } : undefined))
    const downloadLink = document.createElement('a')
    downloadLink.href = blobUrl
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    window.URL.revokeObjectURL(blobUrl)

    notify('Download finished.')
  } catch (error) {
    stopProgress()
    notify(failureMessage, 'error')
    throw error
  }
}
