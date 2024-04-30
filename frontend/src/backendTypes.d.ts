import { type now_locAttributes } from '../../backend/src/models/now_loc'
import { type com_mlist as Museum } from '../../backend/src/models/com_mlist'
import { type com_speciesAttributes } from '../../backend/src/models/com_species'
import { type ref_refAttributes } from '../../backend/src/models/ref_ref'

interface Locality extends now_locAttributes {
  museum_com_mlists: Museum;
  synonyms: string[]
}

interface Reference extends ref_refAttributes {
}

interface Species extends com_speciesAttributes {
}

export {
  Locality,
  Museum,
  Reference,
  Species,
}