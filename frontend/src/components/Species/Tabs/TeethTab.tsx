import { SpeciesDetailsType } from '@/backendTypes'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const TeethTab = () => {
  const { dropdown, textField, data } = useDetailContext<SpeciesDetailsType>()

  const getCtValue = (fct: null | string) => (fct === null || fct === '' ? '-' : fct)
  const formCt = (arr: Array<null | string>) => arr.map(val => getCtValue(val)).join('')

  const functionalCrownType = formCt([data.fct_al, data.fct_ol, data.fct_sf, data.fct_ot, data.fct_cm])

  const calculateNormalizedMesowearScore = () => {
    // Normalized mesowear score: [0-100] -- Scale: max - min -- Display value is calculated (value - min) / scale * 100 => (value - min) / (max - min) * 100
    let mesowear_score

    const mw_scale_min = data.mw_scale_min
    const mw_scale_max = data.mw_scale_max
    const mw_value = data.mw_value

    if (mw_scale_min === null || mw_scale_max === null || mw_value === null) return null

    const scale = mw_scale_max - mw_scale_min <= 0 ? 1 : mw_scale_max - mw_scale_min
    const value = mw_value - mw_scale_min < 0 ? 0 : mw_value - mw_scale_min

    if (mw_value >= mw_scale_min) mesowear_score = (value / scale) * 100
    else return null

    return mesowear_score < 0 || mesowear_score > 100 ? null : mesowear_score.toFixed(2)
  }

  const developmentalCrownType = formCt([
    data.cusp_shape,
    data.cusp_count_buccal,
    data.cusp_count_lingual,
    data.loph_count_lon,
    data.loph_count_trs,
  ])

  const toothShapeMulticuspidOptions = [
    { value: '', display: 'None' },
    { value: 'bil', display: 'Bilophodont' },
    { value: 'bll', display: 'Bucco-Lingual Single Row Of Cusps' },
    { value: 'blm', display: 'Buno-Lamellar' },
    { value: 'bun', display: 'Bunodont' },
    { value: 'bus', display: 'Bunoselenodont' },
    { value: 'col', display: 'Columnar' },
    { value: 'csc', display: 'Carnassial Shear + Crushing Postcanines' },
    { value: 'cso', display: 'Carnassial Shear W/ Other Postcanine Functions' },
    { value: 'csp', display: 'Carnassial Shear Primary' },
    { value: 'cyl', display: 'Cylindrical' },
    { value: 'dil', display: 'Dilambdodont' },
    { value: 'ect', display: 'Ectolophodont (Ectoloph Dominant Edge)' },
    { value: 'edt', display: 'Edentulous' },
    { value: 'lam', display: 'Lamellar' },
    { value: 'lss', display: 'Leaf-Shaped, Serrated' },
    { value: 'md1', display: 'Mesio-Distal Single Row Of Cusps' },
    { value: 'mdp', display: 'Mesio-Distal Multiple Rows Of Cusps' },
    { value: 'plo', display: 'Plagiolophodont (Flat Trilophodonts)' },
    { value: 'qtb', display: 'Quadritubercular' },
    { value: 'sel', display: 'Selenodont (General)' },
    { value: 'tri', display: 'Simple Tritubercular' },
    { value: 'zal', display: 'Zalambdodont' },
  ]

  const hypsodontyOptions = [
    '',
    { display: 'Brachydont', value: 'bra' },
    { display: 'Mesodont', value: 'mes' },
    { display: 'Hypsodont', value: 'hyp' },
    { display: 'Hypselodont', value: 'hys' },
    { display: 'Tooth replacement', value: 'trp' },
    { display: 'Tooth plates', value: 'tpl' },
  ]

  const horizodontyOptions = [
    '',
    { display: 'Brachyhorizodont', value: 'bra' },
    { display: 'Mesohorizodont', value: 'mes' },
    { display: 'Hypsohorizodont', value: 'hyp' },
  ]

  const symphysealMobilityOptions = [emptyOption, { display: 'No', value: 'n' }, { display: 'Yes', value: 'y' }]

  const cuspShapeOptions = [emptyOption, 'R', 'S', 'L']

  const buccalCuspCountOptions = [emptyOption, '0', '1', '2', '3', 'M']

  const lingualCuspCountOptions = [emptyOption, '0', '1', '2', '3', 'M']

  const longitudinalLophCountOptions = [emptyOption, '0', '1', '2', '3', 'M']

  const transverseLophCountOptions = [emptyOption, '0', '1', '2', '3', 'M']

  const acuteLophsOptions = [emptyOption, '0', '1']

  const obtuseLophsOptions = [emptyOption, '0', '1']

  const structuralFortificationOptions = [emptyOption, '0', '1']

  const occlusalTopographyOptions = [emptyOption, '0', '1']

  const coronalCementumOptions = [emptyOption, '0', '1']

  const mesowearOptions = [
    emptyOption,
    { display: 'Abrasion-dominated', value: 'bil' },
    { display: 'Mixed-dominated', value: 'mix' },
    { display: 'Attrition-dominated', value: 'att' },
    { display: 'Unworn', value: 'unw' },
  ]

  const microwearOptions = [
    emptyOption,
    { display: 'Pits predominant', value: 'pit_dom' },
    { display: 'Pits and striae appear equally dominant', value: 'pit_str' },
    { display: 'Striations predominant', value: 'str_dom' },
  ]

  const multicuspid = [
    ['Tooth Shape - Multicuspid', dropdown('tshm', toothShapeMulticuspidOptions, 'Tooth Shape - Multicuspid')],
    ['Hypsodonty', dropdown('crowntype', hypsodontyOptions, 'Hypsodonty')],
    ['Horizodonty', dropdown('horizodonty', horizodontyOptions, 'Horizodonty')],
    ['Symphyseal Mobility', dropdown('symph_mob', symphysealMobilityOptions, 'Symphyseal Mobility')],
    ['Relative Blade Length of Lower Carnassial', textField('relative_blade_length', { type: 'number' })],
  ]

  const developmental = [
    ['Developmental Crown Type', developmentalCrownType],
    ['Cusp shape', dropdown('cusp_shape', cuspShapeOptions, 'Cusp shape')],
    ['Buccal cusp count', dropdown('cusp_count_buccal', buccalCuspCountOptions, 'Buccal cusp count')],
    ['Lingual cusp count', dropdown('cusp_count_lingual', lingualCuspCountOptions, 'Lingual cusp count')],
    ['Longitudinal loph count', dropdown('loph_count_lon', longitudinalLophCountOptions, 'Longitudinal loph count')],
    ['Transverse loph count', dropdown('loph_count_trs', transverseLophCountOptions, 'Transeverse loph count')],
  ]

  const functional = [
    ['Functional Crown Type', functionalCrownType],
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
    ['Cusp Relief Low (OR%)', textField('mw_or_low', { type: 'number' })],
    ['Cusp Relief High (OR%)', textField('mw_or_high', { type: 'number' })],
    ['Cusp Shape Sharp (CS%)', textField('mw_cs_sharp', { type: 'number' })],
    ['Cusp Shape Rounded (CS%)', textField('mw_cs_round', { type: 'number' })],
    ['Cusp Shape Blunt (CS%)', textField('mw_cs_blunt', { type: 'number' })],
    ['Scale Minimum', textField('mw_scale_min', { type: 'number' })],
    ['Scale Maximum', textField('mw_scale_max', { type: 'number' })],
    ['Reported Value', textField('mw_value', { type: 'number' })],
    ['Normalized score', calculateNormalizedMesowearScore()],
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
