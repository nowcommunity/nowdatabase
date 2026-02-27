import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate, type To } from 'react-router-dom'

import { usePageContext } from '@/components/Page'

export type ReturnNavigationDecision =
  | { type: 'state'; target: To }
  | { type: 'stack'; target: string; updatedStack: string[] }
  | { type: 'fallback'; target: string }

type ResolveReturnNavigationArgs = {
  returnTo?: To
  previousUrls: string[]
  fallback: string
}

export const resolveReturnNavigation = ({
  returnTo,
  previousUrls,
  fallback,
}: ResolveReturnNavigationArgs): ReturnNavigationDecision => {
  if (returnTo) {
    return { type: 'state', target: returnTo }
  }

  if (previousUrls.length > 0) {
    const updatedStack = previousUrls.slice(0, -1)
    const target = previousUrls[previousUrls.length - 1]
    return { type: 'stack', target, updatedStack }
  }

  return { type: 'fallback', target: fallback }
}

type UseReturnNavigationOptions = {
  fallback?: string
}

const ensureLeadingSlash = (path: string) => (path.startsWith('/') ? path : `/${path}`)

export const useReturnNavigation = ({ fallback }: UseReturnNavigationOptions = {}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { previousTableUrls, setPreviousTableUrls, viewName } = usePageContext()
  const returnTo = (location.state as { returnTo?: To } | null)?.returnTo

  const fallbackTarget = useMemo(() => {
    if (fallback) {
      return ensureLeadingSlash(fallback)
    }

    if (viewName) {
      return ensureLeadingSlash(viewName)
    }

    const path = location.pathname

    if (/^\/occurrence\/[^/]+\/[^/]+$/.test(path)) {
      return '/occurrence'
    }

    const secondSlashIndex = path.indexOf('/', 1)
    if (secondSlashIndex === -1) {
      return path || '/'
    }

    return path.substring(0, secondSlashIndex)
  }, [fallback, location.pathname, viewName])

  const navigateBack = useCallback(() => {
    const decision = resolveReturnNavigation({
      returnTo,
      previousUrls: previousTableUrls,
      fallback: fallbackTarget,
    })

    if (decision.type === 'state') {
      navigate(decision.target)
      return
    }

    if (decision.type === 'stack') {
      setPreviousTableUrls(decision.updatedStack)
      navigate(decision.target, { relative: 'path' })
      return
    }

    navigate(decision.target, { relative: 'path' })
  }, [fallbackTarget, navigate, previousTableUrls, returnTo, setPreviousTableUrls])

  return {
    navigateBack,
    fallbackTarget,
    origin: returnTo,
  }
}
