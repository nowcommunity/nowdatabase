import { type now_locAttributes } from '../../backend/src/models/now_loc'
import { type com_mlist as Museum } from '../../backend/src/models/com_mlist'

interface Locality extends now_locAttributes {
  museum_com_mlists: Museum;
  synonyms: string[]
}

export {
  Locality,
  Museum,
}