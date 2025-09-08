// cannot be imported from DetailView -> misc since files in shared folder cannot import from elsewhere in frontend
const emptyOption = {
  optionDisplay: 'No value',
  display: '',
  value: '',
}

export const taxonStatusOptions = [
  emptyOption,
  'family attrib of genus uncertain',
  'genus attrib of species uncertain',
  'informal species',
  'species validity uncertain',
  'taxonomic validity uncertain',
  'NOW synonym',
]
