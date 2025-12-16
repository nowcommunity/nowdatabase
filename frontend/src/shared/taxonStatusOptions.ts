// cannot be imported from DetailView -> misc since files in shared folder cannot import from elsewhere in frontend
export type TaxonStatusOption = { optionDisplay: string; display: string; value: string } | string

const taxonStatusOptionList = [
  { optionDisplay: 'No value', display: '', value: '' },
  'family attrib of genus uncertain',
  'genus attrib of species uncertain',
  'informal species',
  'species validity uncertain',
  'taxonomic validity uncertain',
  'NOW synonym',
] as const satisfies ReadonlyArray<TaxonStatusOption>

export const taxonStatusOptions: TaxonStatusOption[] = [...taxonStatusOptionList]
