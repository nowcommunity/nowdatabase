import { type now_locAttributes } from '../../backend/src/models/now_loc'
import { type com_mlist as Museum } from '../../backend/src/models/com_mlist'
import { type com_speciesAttributes } from '../../backend/src/models/com_species'

interface Locality extends now_locAttributes {
  museum_com_mlists: Museum;
  synonyms: string[]
}

interface Species extends com_speciesAttributes {
}

export {
  Locality,
  Museum,
  Species,
}