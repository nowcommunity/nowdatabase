import { EditDataType, Species, SpeciesDetailsType } from '@/shared/types'

export const toSpeciesDetailsDraft = (
  input: Partial<EditDataType<Species>> & { class_name?: string | null }
): EditDataType<SpeciesDetailsType> => {
  return {
    now_ls: [],
    com_taxa_synonym: [],
    now_sau: [],
    species_id: input.species_id,
    class_name: input.class_name ?? undefined,
    subclass_or_superorder_name: input.subclass_or_superorder_name ?? '',
    order_name: input.order_name ?? undefined,
    suborder_or_superfamily_name: input.suborder_or_superfamily_name ?? '',
    family_name: input.family_name ?? undefined,
    subfamily_name: input.subfamily_name ?? '',
    genus_name: input.genus_name ?? undefined,
    species_name: input.species_name ?? undefined,
    unique_identifier: input.unique_identifier ?? undefined,
    taxonomic_status: input.taxonomic_status ?? '',
    sp_comment: input.sp_comment,
    sp_author: input.sp_author,
  }
}
