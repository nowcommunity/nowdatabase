import { type now_locAttributes } from '../../backend/src/models/now_loc'
import { type now_time_unitAttributes } from '../../backend/src/models/now_time_unit'
import { type com_mlistAttributes as Museum } from '../../backend/src/models/com_mlist'
import { type com_speciesAttributes } from '../../backend/src/models/com_species'
import { type ref_refAttributes } from '../../backend/src/models/ref_ref'
import { type ref_authorsAttributes as Ref_Authors } from '../../backend/src/models/ref_authors';
import { type ref_journalAttributes as Ref_Journal } from '../../backend/src/models/ref_journal';
import { type ref_ref_type as Ref_Type } from '../../backend/src/models/ref_ref_type';

interface Locality extends now_locAttributes {
  museum_com_mlists: Museum;
  synonyms: string[]
}

interface Reference extends ref_refAttributes {
  ref_authors: Ref_Authors[]
  journal_title: string
  type: Ref_Type
}

interface Species extends com_speciesAttributes {
}

interface TimeUnit extends now_time_unitAttributes {
}

export {
  Locality,
  Museum,
  Reference,
  Species,
  TimeUnit,
}