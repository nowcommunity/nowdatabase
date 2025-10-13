import { EditDataType, SpeciesSynonym } from '../types'
import { Validators, validator } from './validator'

export const validateSynonym = (
  editData: EditDataType<SpeciesSynonym>,
  fieldName: keyof EditDataType<SpeciesSynonym>
) => {
  const validators: Validators<Partial<EditDataType<SpeciesSynonym>>> = {
    syn_genus_name: {
      name: 'Synonym genus name',
      required: true,
      asString: (synGenusName: string) => {
        if (synGenusName.indexOf(' ') !== -1) return 'Genus must not contain any spaces.'
        return
      },
    },
    syn_species_name: {
      name: 'Synonym species name',
      required: true,
      asString: (synSpeciesName: string) => {
        if (synSpeciesName !== 'indet.' && editData.syn_genus_name === 'indet.')
          return 'when the Genus is indet., Species must also be indet.'
        if (synSpeciesName !== 'sp.' && editData.syn_genus_name === 'gen.')
          return 'when the Genus is gen., Species must be sp.'
        return
      },
    },
  }

  return validator<EditDataType<SpeciesSynonym>>(validators, editData, fieldName)
}
