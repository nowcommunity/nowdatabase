import { EditDataType, PersonDetailsType } from '../../../../frontend/src/shared/types'
import Prisma from '../../../prisma/generated/now_test_client'
import { nowDb, getFieldsOfTables } from '../../utils/db'
import { filterAllowedKeys } from './writeOperations/utils'

export const writePerson = async (person: EditDataType<PersonDetailsType>) => {
  const allowedColumns = getFieldsOfTables(['com_people'])
  const filteredPerson = filterAllowedKeys(person, allowedColumns) as Prisma.com_people
  let personId: string

  if (!filteredPerson.initials) {
    throw new Error('Missing initials, creating new persons is not yet implemented')
  } else {
    await nowDb.com_people.update({
      where: { initials: person.initials },
      data: { ...filteredPerson, full_name: `${filteredPerson.first_name} ${filteredPerson.surname}` },
    })
    personId = filteredPerson.initials
  }

  return personId
}
