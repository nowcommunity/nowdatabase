import { PersonDetailsType } from '../../../../frontend/src/shared/types'

export const existingPerson: Omit<PersonDetailsType, 'user'> = {
  initials: 'AD',
  first_name: 'adf',
  surname: 'ads',
  full_name: 'adf ads',
  format: null,
  email: 'email',
  user_id: 156,
  organization: 'organization',
  country: 'Finland',
  password_set: new Date('2024-05-22T00:00:00.000Z'),
  used_morph: null,
  used_now: null,
  used_gene: null,
}

export const editedPerson = {
  initials: existingPerson.initials,
  first_name: 'Test first name',
  surname: 'Test surname',
  email: 'test.email@emailprovider.com',
  organization: 'Test organization',
  country: 'Test country',
}
