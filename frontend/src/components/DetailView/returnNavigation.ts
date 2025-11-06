import type { To } from 'react-router-dom'

export type ReturnNavigationDecision =
  | { type: 'state'; target: To }
  | { type: 'stack'; target: string; updatedStack: string[] }
  | { type: 'fallback'; target: string }

export const resolveReturnNavigation = ({
  returnTo,
  previousUrls,
  fallback,
}: {
  returnTo?: To
  previousUrls: string[]
  fallback: string
}): ReturnNavigationDecision => {
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
