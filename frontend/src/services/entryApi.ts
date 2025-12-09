export type FinalizeEntryParams = {
  isDirty: boolean
  finalize: () => Promise<void> | void
  onBlocked?: () => void
}

export const finalizeEntry = async ({ isDirty, finalize, onBlocked }: FinalizeEntryParams) => {
  if (!isDirty) {
    onBlocked?.()
    return { blocked: true as const }
  }

  await finalize()
  return { blocked: false as const }
}
