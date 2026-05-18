export const referenceWithoutExactDateSelect = {
  rid: true,
  ref_type_id: true,
  journal_id: true,
  title_primary: true,
  date_primary: true,
  volume: true,
  issue: true,
  start_page: true,
  end_page: true,
  publisher: true,
  pub_place: true,
  title_secondary: true,
  date_secondary: true,
  title_series: true,
  issn_isbn: true,
  ref_abstract: true,
  web_url: true,
  misc_1: true,
  misc_2: true,
  gen_notes: true,
  printed_language: true,
  used_morph: true,
  used_now: true,
  used_gene: true,
  ref_authors: true,
  ref_journal: true,
} as const

export const addNullExactDateToReference = <T extends object>(reference: T) => ({
  ...reference,
  exact_date: null,
})

export const addNullExactDateToReferenceJoins = <T extends { ref_ref: object }>(references: T[]) =>
  references.map(reference => ({
    ...reference,
    ref_ref: addNullExactDateToReference(reference.ref_ref),
  }))
