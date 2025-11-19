import { Editable, LocalityProject } from '../../../../frontend/src/shared/types'

export const removeDuplicateProjectLinks = <
  T extends { pid: number; rowState?: Editable<LocalityProject>['rowState'] }
>(
  pendingLinks: T[],
  existingProjectIds: Set<number>,
) => {
  const seenNew = new Set<number>()
  return pendingLinks.filter(link => {
    if (link.rowState === 'new') {
      if (existingProjectIds.has(link.pid) || seenNew.has(link.pid)) {
        return false
      }
      seenNew.add(link.pid)
    }
    return true
  })
}
