import { SpeciesDetails } from '@/backendTypes'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const TeethTab = () => {
  const { dropdown, textField } = useDetailContext<SpeciesDetails>()

  const toothShapeMulticuspidOptions = [
    { value: '', display: 'None' },
    'bil',
    'bll',
    'blm',
    'bun',
    'bus',
    'col',
    'csc',
    'cso',
    'csp',
    'cyl',
    'dil',
    'ect',
    'edt',
    'lam',
    'lss',
    'md1',
    'mdp',
    'plo',
    'qtb',
    'sel',
    'tri',
    'zal',
  ]

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

  const multicuspid = [
    ['Tooth Shape - Multicuspid', dropdown('tshm', toothShapeMulticuspidOptions, 'Tooth Shape - Multicuspid')],
    ['Hypsodonty', dropdown('crowntype', hypsodontyOptions, 'Hypsodonty')],
    ['Horizodonty', dropdown('horizodonty', horizodontyOptions, 'Horizodonty')],
    ['Symphyseal Mobility', dropdown('symph_mob', symphysealMobilityOptions, 'Symphyseal Mobility')],
    ['Relative Blade Length of Lower Carnassial', textField('relative_blade_length')],
  ]

  const developmental = [
    ['Cusp shape', dropdown('cusp_shape', cuspShapeOptions, 'Cusp shape')],
    ['Buccal cusp count', dropdown('cusp_count_buccal', buccalCuspCountOptions, 'Buccal cusp count')],
    ['Lingual cusp count', dropdown('cusp_count_lingual', lingualCuspCountOptions, 'Lingual cusp count')],
    ['Longitudinal loph count', dropdown('loph_count_lon', longitudinalLophCountOptions, 'Longitudinal loph count')],
    ['Transverse loph count', dropdown('loph_count_trs', transverseLophCountOptions, 'Transeverse loph count')],
  ]

  const functional = [
    ['Presence of acute lophs (AL)', dropdown('fct_al', acuteLophsOptions, 'Presence of acute lophs (AL)')],
    [
      'Presence of obtuse or basin-like lophs (OL)',
      dropdown('fct_ol', obtuseLophsOptions, 'Presence of obtuse or basin-like lophs (OL)'),
    ],
    [
      'Structural fortification of cusps (SF)',
      dropdown('fct_sf', structuralFortificationOptions, 'Structural fortification of cusps (SF)'),
    ],
    ['Occlusal topography (OT)', dropdown('fct_ot', occlusalTopographyOptions, 'Occlusal topography (OT)')],
    ['Coronal cementum (CM)', dropdown('fct_cm', coronalCementumOptions, 'Coronal cementum (CM)')],
  ]

  const mesowear = [
    ['Mesowear'],
    ['Type', dropdown('mesowear', mesowearOptions, 'Type')],
    ['Cusp Relief Low (OR%)', textField('mw_or_low')],
    ['Cusp Relief High (OR%)', textField('mw_or_high')],
    ['Cusp Shape Sharp (CS%)', textField('mw_cs_sharp')],
    ['Cusp Shape Rounded (CS%)', textField('mw_cs_round')],
    ['Cusp Shape Blunt (CS%)', textField('mw_cs_blunt')],
    ['Scale Minimum', textField('mw_scale_min')],
    ['Scale Maximum', textField('mw_scale_max')],
    ['Reported Value', textField('mw_value')],
    ['Normalized score'],
    ['Microwear'],
    ['Type', dropdown('microwear', microwearOptions, 'Type')],
  ]

  return (
    <>
      <HalfFrames>
        <ArrayFrame half array={multicuspid} title="" />
        <ArrayFrame half array={developmental} title="" />
      </HalfFrames>
      <HalfFrames>
        <ArrayFrame half array={functional} title="" />
        <ArrayFrame half array={mesowear} title="" />
      </HalfFrames>
    </>
  )
}
