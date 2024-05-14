import { Editable, LocalityDetails, LocalitySynonym } from '@/backendTypes'
import { ArrayFrame, HalfFrames } from '../../DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { EditableTable, EditingModal, Grouped } from '@/components/DetailView/common/FormComponents'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const LocalityTab = () => {
  const { textField } = useDetailContext<LocalityDetails>()

  const info = [
    ['Name', textField('loc_name')],
    ['Status', textField('loc_status')],
  ]
  const country = [
    ['Country', textField('country')],
    ['State', textField('state')],
    ['County', textField('county')],
    ['Detail', textField('loc_detail')],
    ['Site Area', textField('site_area')],
    ['General Locality', textField('gen_loc')],
    ['Plate', textField('plate')],
  ]
  const latlong = [
    ['', 'dms', 'dec'],
    ['Latitude', textField('dms_lat'), textField('dec_lat')],
    ['Longitude', textField('dms_long'), textField('dec_long')],
    ['Approximate Coordinates', textField('approx_coord')],
    ['Altitude (m)', textField('altitude')],
  ]

  const { editData, mode } = useDetailContext<LocalityDetails>()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [data, setData] = useState('')

  const columns: MRT_ColumnDef<LocalitySynonym>[] = [
    {
      accessorKey: 'synonym',
      header: 'Synonym',
    },
  ]

  const onSave = async () => {
    // TODO: Saving logic here (add Synonym to editData)
    return Object.keys(errors).length === 0
  }

  const editingModal = (
    <EditingModal buttonText="Add new Synonym" onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField {...register('synonym', { required: true })} label="Synonym" required />
      </Box>
    </EditingModal>
  )

  return (
    <>
      <HalfFrames>
        <ArrayFrame array={info} title="Info" />
        <ArrayFrame array={country} title="Country" />
      </HalfFrames>

      <HalfFrames>
        <ArrayFrame array={latlong} title="Latitude & Longitude" />

        <Grouped title="Synonyms">
          {mode === 'edit' && editingModal}
          <EditableTable<Editable<LocalitySynonym>, LocalityDetails>
            columns={columns}
            data={editData.now_syn_loc}
            editable
            field="synonyms"
          />
        </Grouped>
      </HalfFrames>
    </>
  )
}
