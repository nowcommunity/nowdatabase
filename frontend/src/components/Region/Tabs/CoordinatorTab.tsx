import {
  RegionDetails,
  RegionCoordinator,
  RegionCountry,
  PersonDetailsType,
  RegionDetailsWithComPeople,
} from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, Grouped, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useGetAllPersonsQuery } from '@/redux/personReducer'
import { skipToken } from '@reduxjs/toolkit/query'
import { useMemo, useState } from 'react'
import { formatLastLoginDate } from '@/common'
import { CircularProgress, Box, FormControl, Autocomplete, Button, TextField, FormHelperText } from '@mui/material'
import { validCountries } from '@/shared/validators/countryList'

export const CoordinatorTab = () => {
  const { mode, editData, setEditData, validator, textField } = useDetailContext<RegionDetailsWithComPeople>()
  const { data: personsData, isLoading, isError } = useGetAllPersonsQuery(mode.read ? skipToken : undefined)
  const [dropdownValue, setDropdownValue] = useState('')

  const countryError = validator(editData, 'now_reg_coord_country').error

  const onSave = () => {
    if (countryError || dropdownValue === '') return false
    setEditData({
      ...editData,
      now_reg_coord_country: [
        ...editData.now_reg_coord_country,
        {
          reg_coord_id: editData.reg_coord_id,
          country: dropdownValue,
          rowState: 'new',
        },
      ],
    })
    setDropdownValue('')
    return true
  }

  const NewCountryForm = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1em', marginBottom: '1em' }}>
        <FormControl size="small" error={!!countryError}>
          <Autocomplete
            sx={{ minWidth: '15em' }}
            id={'country-multiselect'}
            options={validCountries}
            autoHighlight={true}
            value={dropdownValue}
            onChange={(_, newValue) => {
              setDropdownValue(newValue ?? '')
            }}
            renderInput={params => <TextField {...params} label="Add a new country" error={!!countryError} />}
          />

          {countryError && <FormHelperText>{countryError}</FormHelperText>}
        </FormControl>
        <Button
          id={'country-add-button'}
          sx={{ maxHeight: '4em' }}
          variant="contained"
          disabled={!!countryError || !dropdownValue}
          onClick={() => void onSave()}
        >
          Save
        </Button>
      </Box>
    )
  }

  const personColumns = useMemo<MRT_ColumnDef<PersonDetailsType>[]>(
    () => [
      {
        accessorKey: 'initials',
        id: 'person_id',
        header: 'Person Id',
      },
      {
        accessorKey: 'first_name',
        header: 'First name',
      },
      {
        accessorKey: 'surname',
        header: 'Surname',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'organization',
        header: 'Organisation',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
      {
        id: 'user_id',
        accessorKey: 'user.user_id',
        header: 'User Id',
        size: 20,
      },
      {
        accessorKey: 'user.user_name',
        header: 'User name',
      },
      {
        accessorFn: (person: PersonDetailsType) =>
          person.user?.last_login ? formatLastLoginDate(person.user?.last_login) : 'None',
        header: 'Last login',
      },
      {
        accessorKey: 'initials',
        header: 'Initials',
      },

      {
        accessorKey: 'user.now_user_group',
        header: 'User role',
      },
    ],
    []
  )

  const coordinator: MRT_ColumnDef<RegionCoordinator>[] = [
    {
      accessorKey: 'com_people.surname',
      header: 'Surname',
    },
    {
      accessorKey: 'com_people.first_name',
      header: 'First name',
    },
    {
      accessorKey: 'com_people.organization',
      header: 'Organization',
    },
  ]

  const country: MRT_ColumnDef<RegionCountry>[] = [
    {
      accessorKey: 'country',
      header: 'Country',
    },
  ]

  const regionName = [['Name', textField('region')]]

  if (isLoading) return <CircularProgress />

  return (
    <>
      <ArrayFrame half array={regionName} title="Region" />
      <Grouped title="Regional Coordinators">
        {!mode.read && (
          <SelectingTable<PersonDetailsType, RegionDetails>
            buttonText="Select Coordinator"
            data={personsData}
            isError={isError}
            columns={personColumns}
            fieldName="now_reg_coord_people"
            idFieldName="initials"
            editingAction={(newCoordinator: PersonDetailsType) => {
              setEditData({
                ...editData,
                now_reg_coord_people: [
                  ...editData.now_reg_coord_people,
                  {
                    reg_coord_id: editData.reg_coord_id,
                    initials: newCoordinator.initials,
                    com_people: { ...newCoordinator },
                    rowState: 'new',
                  },
                ],
              })
            }}
          />
        )}
        <EditableTable<RegionCoordinator, RegionDetails>
          columns={coordinator}
          editTableData={editData.now_reg_coord_people}
          field="now_reg_coord_people"
          idFieldName="initials"
          url="person"
        />
      </Grouped>
      <Grouped title="Countries">
        {!mode.read && <NewCountryForm />}
        <EditableTable<RegionCountry, RegionDetails>
          columns={country}
          editTableData={editData.now_reg_coord_country}
          field="now_reg_coord_country"
        />
      </Grouped>
    </>
  )
}
