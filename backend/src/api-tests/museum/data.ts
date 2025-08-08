import { Museum } from '../../../../frontend/src/shared/types'

export const newMuseumBasis: Museum = {
  museum: 'AM',
  institution: 'Australian Museum',
  alt_int_name: '',
  city: 'Sydney',
  state_code: '',
  state: '',
  country: 'Australia',
  used_morph: true,
  used_now: null,
  used_gene: null,
}

export const editedMuseum: Museum = {
  ...newMuseumBasis,
  institution: 'Australian Museum',
  alt_int_name: '',
  city: 'Canberra',
  state_code: 'NSW',
  state: 'New South Wales',
  country: 'Australia',
  used_morph: false,
  used_now: true,
  used_gene: null,
}
