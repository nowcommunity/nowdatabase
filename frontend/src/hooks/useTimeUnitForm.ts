import { EditDataType, TimeUnitDetailsType } from '@/shared/types'

export const useTimeUnitForm = () => {
  const normalizeRank = (editData: EditDataType<TimeUnitDetailsType>) => {
    const normalizedRank = editData.rank === '' ? null : editData.rank

    return {
      ...editData,
      rank: normalizedRank,
    }
  }

  return { normalizeRank }
}
