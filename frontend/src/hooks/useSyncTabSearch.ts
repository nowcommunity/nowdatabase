import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useSyncTabSearch = (tab: number) => {
  const location = useLocation()
  const navigate = useNavigate()
  const preservedStateRef = useRef<unknown>(location.state as unknown)
  const lastLocationKeyRef = useRef(location.key)

  useEffect(() => {
    if (location.state !== undefined && location.state !== null) {
      preservedStateRef.current = location.state as unknown
    } else if (location.key !== lastLocationKeyRef.current) {
      preservedStateRef.current = location.state as unknown
    }

    lastLocationKeyRef.current = location.key
  }, [location.key, location.state])

  useEffect(() => {
    const nextSearch = `?tab=${tab}`
    if (location.search === nextSearch) {
      return
    }

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch,
      },
      {
        replace: true,
        state: preservedStateRef.current,
      }
    )
  }, [location.pathname, location.search, navigate, tab])
}
