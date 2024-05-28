import { LocalityDetails } from '@/backendTypes'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/hooks'

export const ClimateTab = () => {
  const { textField, dropdown, bigTextField } = useDetailContext<LocalityDetails>()

  const climateTypeOptions = [
    '',
    { display: 'Cold temperate', value: 'cold_temperate' },
    { display: 'Paratropical', value: 'paratropical' },
    { display: 'Subtropical', value: 'subtropical' },
    { display: 'Temperate', value: 'temperate' },
    { display: 'Tropical', value: 'tropical' },
  ]

  const temperatureOptions = [
    '',
    { display: 'Cold', value: 'cold' },
    { display: 'Hot', value: 'hot' },
    { display: 'Moderate', value: 'mod' },
  ]

  const moistureOptions = [
    '',
    { display: 'Dry', value: 'dry' },
    { display: 'Intermediate', value: 'int' },
    { display: 'Wet', value: 'wet' },
  ]

  const agentOfDisturbanceOptions = [
    '',
    { display: 'Fire', value: 'fire' },
    { display: 'Fire-Wind', value: 'fire-wind' },
    { display: 'Water', value: 'water' },
    { display: 'Water-Fire', value: 'water-fire' },
    { display: 'Water-Wind', value: 'water-wind' },
    { display: 'Water-Fire-Wind', value: 'water-fire-wind' },
    { display: 'Wind', value: 'wind' },
  ]

  const seasonalityOptions = [
    '',
    { display: 'Light', value: 'light' },
    { display: 'Light-Temperature', value: 'light-temp' },
    { display: 'None', value: 'none' },
    { display: 'Temperature', value: 'temp' },
    { display: 'Water', value: 'water' },
    { display: 'Water-Light', value: 'water-light' },
    { display: 'Water-Light-Temperature', value: 'water-light-temp' },
  ]

  const biomeOptions = [
    '',
    { display: 'Broad-leaved evergreen forest', value: 'bl_evergreen_f' },
    { display: '"Mediterranean" sclerophyll vegetation', value: 'chaparral' },
    { display: 'Coniferous forest - including boreal and subalpine', value: 'coniferous_f' },
    { display: 'Deciduous forest - e.g., temperate angiosperm forests', value: 'deciduous_f' },
    { display: 'Arid, both hot and cold desert', value: 'desert' },
    { display: 'Treeless grasslands, including prairie, steppe', value: 'grassland' },
    { display: 'Savanna - including bush, etc., with trees widely spaced', value: 'savanna' },
    { display: 'Semi-deciduous forest', value: 'semi-decid_f' },
    { display: 'Tundra - including alpine tundra', value: 'tundra' },
    { display: 'Woodland - non-closed canopy, trees closely spaced', value: 'woodland' },
  ]

  const vegetationHeightOptions = [
    '',
    { display: 'Less than 2 m', value: '<2m' },
    { display: '2-5 m', value: '2-5m' },
    { display: 'Greater 5m', value: '>5m' },
  ]

  const vegetationStructureOptions = [
    '',
    { display: 'Closed', value: 'closed' },
    { display: 'Open', value: 'open' },
    { display: 'Semi-open', value: 'semi-open' },
  ]

  const primaryProductivityLevelOptions = [
    '',
    { display: 'High', value: 'high' },
    { display: 'Low', value: 'low' },
    { display: 'Medium', value: 'med' },
  ]

  const nutrientAvailabilityOptions = ['', { display: 'Low', value: 'low' }, { display: 'Not low', value: 'not_low' }]

  const waterAvailabilityOptions = [
    '',
    { display: 'Mesic', value: 'mesic' },
    { display: 'Seasonal', value: 'seasonal' },
    { display: 'Wet', value: 'wet' },
    { display: 'Xeric', value: 'xeric' },
  ]

  const environment = [
    ['Climate Type', dropdown('climate_type', climateTypeOptions, 'Climate Type')],
    ['Temperature', dropdown('temperature', temperatureOptions, 'Temperature')],
    ['Moisture', dropdown('moisture', moistureOptions, 'Moisture')],
    ['Agent(s) of Disturbance', dropdown('disturb', agentOfDisturbanceOptions, 'Agent(s) of Disturbance')],
  ]

  const environmentAndVegetationDetail = [['Environment & Vegetation Detail', bigTextField('v_envi_det')]]

  const season = [
    ['Seasonality', dropdown('seasonality', seasonalityOptions, 'Seasonality')],
    ['Seasonality Intensity', textField('seas_intens')],
  ]

  const vegetation = [
    ['Biome', dropdown('biome', biomeOptions, 'Biome')],
    ['Vegetation Height', dropdown('v_ht', vegetationHeightOptions, 'Vegetation Height')],
    ['Vegetation Structure', dropdown('v_struct', vegetationStructureOptions, 'Vegetation Structure')],
    ['Primary Productivity Level', dropdown('pri_prod', primaryProductivityLevelOptions, 'Primary Productivity Level')],
  ]

  const plantSites = [
    ['Nutrient Availability', dropdown('nutrients', nutrientAvailabilityOptions, 'Nutrient Availability')],
    ['Water Availability', dropdown('water', waterAvailabilityOptions, 'Water Availability')],
  ]

  const pollenRecord = [
    ['Arboreal pollen (AP%)', textField('pers_pollen_ap')],
    ['Non-arboreal pollen (NAP%)', textField('pers_pollen_nap')],
    ['Other pollen (OP%)', textField('pers_pollen_other')],
  ]

  return (
    <>
      <HalfFrames>
        <ArrayFrame half array={environment} title="Environment" />
        <ArrayFrame half array={environmentAndVegetationDetail} title="Environment & Vegetation Detail" />
      </HalfFrames>
      <HalfFrames>
        <ArrayFrame half array={vegetation} title="Vegetation" />
        <ArrayFrame half array={season} title="Season" />
      </HalfFrames>
      <HalfFrames>
        <ArrayFrame half array={plantSites} title="Plant Sites" />
        <ArrayFrame half array={pollenRecord} title="Pollen Record" />
      </HalfFrames>
    </>
  )
}
