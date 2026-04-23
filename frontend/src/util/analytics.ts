import { ENV, GA4_MEASUREMENT_ID } from './config'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const canTrack = () => {
  if (ENV === 'dev') return false
  if (!GA4_MEASUREMENT_ID) return false

  // Honor "Do Not Track" signals when present.
  const win = window as Window & { doNotTrack?: string }
  const dnt = navigator.doNotTrack === '1' || win.doNotTrack === '1'
  if (dnt) return false

  return true
}

let initialized = false

const ensureGtagLoaded = () => {
  if (initialized) return
  if (!canTrack()) return

  if (typeof document === 'undefined') return

  const srcId = 'ga4-gtag-src'
  if (!document.getElementById(srcId)) {
    const script = document.createElement('script')
    script.id = srcId
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID!)}`
    document.head.appendChild(script)
  }

  window.dataLayer = window.dataLayer ?? []
  window.gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args)
    })

  window.gtag('js', new Date())
  window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true })

  initialized = true
}

export const trackPageView = (path: string) => {
  if (!canTrack()) return
  ensureGtagLoaded()
  window.gtag?.('event', 'page_view', { page_path: path })
}
