import { Box } from '@mui/material'
import { SpeciesDetails } from '@/backendTypes'
import { ArrayFrame, DataValue } from '@components/DetailView/common/FormComponents'
import { useGetEditableTextField, useGetMultiSelection, useGetRadioSelection } from '@components/DetailView/hooks'

export const TeethTab = () => {
  const getEditableTextField = useGetEditableTextField<SpeciesDetails>()
  const getRadioSelection = useGetRadioSelection<SpeciesDetails>()
  const getMultiSelection = useGetMultiSelection<SpeciesDetails>()

  const textField = (field: keyof SpeciesDetails) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getEditableTextField(field)} />
  )

  const radioSelection = (field: keyof SpeciesDetails, options: string[], name: string) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getRadioSelection({ fieldName: field, options, name })} />
  )

  const multiSelection = (field: keyof SpeciesDetails, options: string[], name: string) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getMultiSelection({ fieldName: field, options, name })} />
  )

  const toothShapeMulticuspidOptions = ['', 'bil', 'bll', 'blm', 'bun',
    'bus', 'col', 'csc', 'cso', 'csp', 'cyl', 'dil', 'ect', 'edt',
    'lam', 'lss', 'md1', 'mdp', 'plo', 'qtb', 'sel', 'tri', 'zal']

  const hypsodontyOptions = ['', 'bra', 'mes', 'hyp', 'hys', 'trp', 'tpl']

  const horizodontyOptions = ['', 'bra', 'mes', 'hyp']

  const symphysealMobilityOptions = ['', 'y', 'n']

  const cuspShapeOptions = ['', 'R', 'S', 'L']

  const buccalCuspCountOptions = ['', '0', '1', '2', '3', 'M']

  const lingualCuspCountOptions = ['', '0', '1', '2', '3', 'M']

  const longitudinalLophCountOptions = ['', '0', '1', '2', '3', 'M']

  const transverseLophCountOptions = ['', '0', '1', '2', '3', 'M']

  const acuteLophsOptions = ['', '0', '1']

  const obtuseLophsOptions = ['', '0', '1']

  const structuralFortificationOptions = ['', '0', '1']

  const occlusalTopographyOptions = ['', '0', '1']

  const coronalCementumOptions = ['', '0', '1']

  const mesowearOptions = ['', 'bil', 'mix', 'att', 'unw']

  const microwearOptions = ['', 'pit_dom', 'pit_str', 'str_dom']

  const teeth = [
    ['Tooth Shape - Multicuspid', multiSelection('tshm', toothShapeMulticuspidOptions, 'Tooth Shape - Multicuspid'),
      'Developmental Crown Type',
      'Functional Crown Type',
      'Mesowear'
    ],
    ['Hypsodonty', multiSelection('crowntype', hypsodontyOptions, 'Hypsodonty'),
      'Cusp shape', multiSelection('cusp_shape', cuspShapeOptions, 'Cusp shape'),
      'Presence of acute lophs (AL)', multiSelection('fct_al', acuteLophsOptions, 'Presence of acute lophs (AL)'),
      'Type', multiSelection('mesowear', mesowearOptions, 'Type')
    ],
    ['Horizodonty', multiSelection('horizodonty', horizodontyOptions, 'Horizodonty'),
      'Buccal cusp count', multiSelection('cusp_count_buccal', buccalCuspCountOptions, 'Buccal cusp count'),
      'Presence of obtuse or basin-like lophs (OL)', multiSelection('fct_ol', obtuseLophsOptions, 'Presence of obtuse or basin-like lophs (OL)'),
      'Cusp Relief Low (OR%)', textField('mw_or_low')
    ],
    ['Symphyseal Mobility', multiSelection('symph_mob', symphysealMobilityOptions,'Symphyseal Mobility'),
      'Lingual cusp count', multiSelection('cusp_count_lingual', lingualCuspCountOptions, 'Lingual cusp count'),
      'Structural fortification of cusps (SF)', multiSelection('fct_sf', structuralFortificationOptions, 'Structural fortification of cusps (SF)'),
      'Cusp Relief High (OR%)', textField('mw_or_high')
    ],
    ['Relative Blade Length of Lower Carnassial', textField('relative_blade_length'),
      'Longitudinal loph count', multiSelection('loph_count_lon', longitudinalLophCountOptions, 'Longitudinal loph count'),
      'Occlusal topography (OT)', multiSelection('fct_ot', occlusalTopographyOptions, 'Occlusal topography (OT)'),
      'Cusp Shape Sharp (CS%)', textField('mw_cs_sharp')
    ],
    ['',
      'Transverse loph count', multiSelection('loph_count_trs', transverseLophCountOptions, 'Transverse loph count'),
      'Coronal cementum (CM)', multiSelection('fct_cm', coronalCementumOptions, 'Coronal cementum (CM)'),
      'Cusp Shape Rounded (CS%)', textField('mw_cs_round')
    ],
    ['',
      '',
      '',
      'Cusp Shape Blunt (CS%)', textField('mw_cs_blunt')
    ],
    ['',
      '',
      '',
      'Scale Minimum', textField('mw_scale_min')
    ],
    ['',
      '',
      '',
      'Scale Maximum', textField('mw_scale_max')
    ],
    ['',
      '',
      '',
      'Reported Value', textField('mw_value')
    ],
    ['',
      '',
      '',
      'Normalized Score'
    ],
    ['',
      '',
      '',
      'Microwear '
    ],
    ['',
      '',
      '',
      'Type', multiSelection('microwear', microwearOptions, 'Type'),
    ],
  ]


  return (
    <Box>
      <ArrayFrame array={teeth} title="Teeth" />
    </Box>
  )
}
