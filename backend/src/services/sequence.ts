import { nowDb } from '../utils/db'

export const getAllSequences = async () => {
  const sequences = nowDb.now_tu_sequence.findMany({})
  return sequences
}
