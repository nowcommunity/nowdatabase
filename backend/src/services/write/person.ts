import { EditDataType, PersonDetailsType } from '../../../../frontend/src/shared/types'
import Prisma from '../../../prisma/generated/now_test_client'
import { nowDb, getFieldsOfTables } from '../../utils/db'
import { getPersonDetails } from '../person'
import { filterAllowedKeys } from './writeOperations/utils'

export const writePerson = async (person: EditDataType<PersonDetailsType>) => {
  const allowedColumns = getFieldsOfTables(['com_people'])
  const filteredPerson = filterAllowedKeys(person, allowedColumns) as Prisma.com_people
  let personId: string

  const isPerson = await getPersonDetails(filteredPerson.initials)

  if (!isPerson) {
    const newPerson = await nowDb.com_people.create({
      data: { ...filteredPerson, full_name: `${filteredPerson.first_name} ${filteredPerson.surname}` },
    })
    personId = newPerson.initials
  } else {
    await nowDb.com_people.update({
      where: { initials: person.initials },
      data: {
        first_name: filteredPerson.first_name,
        surname: filteredPerson.surname,
        email: filteredPerson.email,
        organization: filteredPerson.organization,
        country: filteredPerson.country,
        full_name: `${filteredPerson.first_name} ${filteredPerson.surname}`,
      },
    })
    personId = filteredPerson.initials
  }

  return personId
}
