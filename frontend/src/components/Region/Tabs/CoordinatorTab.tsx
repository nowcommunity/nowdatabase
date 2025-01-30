import {
  RegionDetails,
  RegionCoordinator,
  RegionCountry,
  Region,
  User,
  PersonDetailsType,
  RegionDetailsWithComPeople,
} from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { MRT_ColumnDef } from 'material-react-table'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { useGetAllPersonsQuery } from '@/redux/personReducer'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useMemo } from 'react'
import { formatLastLoginDate } from '@/common'
import { CircularProgress, Box } from '@mui/material'

export const CoordinatorTab = () => {
  const { mode, editData, setEditData } = useDetailContext<RegionDetailsWithComPeople>()
  const { data: personsData, isLoading, isError } = useGetAllPersonsQuery(mode.read ? skipToken : undefined)

  const personColumns = useMemo<MRT_ColumnDef<PersonDetailsType>[]>(
    () => [
      {
        accessorKey: 'initials',
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

  if (isLoading) return <CircularProgress />

  console.log(editData)

  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'country', label: 'Country', required: true },
  ]

  // TODO: Selecting existing User or Country
  return (
    <>
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
        {!mode.read && (
          <Box display="flex" gap={1}>
            <EditingForm<RegionCountry, RegionDetails>
              buttonText="Add new Country"
              formFields={formFields}
              editAction={(newCountry: RegionCountry) => {
                setEditData({
                  ...editData,
                  now_reg_coord_country: [
                    ...editData.now_reg_coord_country,
                    {
                      reg_coord_id: editData.reg_coord_id,
                      country: newCountry.country,
                      rowState: 'new',
                    },
                  ],
                })
              }}
            />
          </Box>
        )}
        <EditableTable<RegionCountry, RegionDetails>
          columns={country}
          editTableData={editData.now_reg_coord_country}
          field="now_reg_coord_country"
        />
      </Grouped>
    </>
  )
}
