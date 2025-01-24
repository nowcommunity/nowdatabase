import { RegionCoordinator } from '../../../../frontend/src/shared/types'
import Prisma from '../../../prisma/generated/now_test_client'

export const existingCoordinator: RegionCoordinator & { com_people: Prisma.com_people } = {
  reg_coord_id: 1,
  initials: 'PR',
  com_people: {
    initials: 'PR',
    first_name: 'prf',
    surname: 'prs',
    full_name: 'prf prs',
    format: null,
    email: 'email',
    user_id: 160,
    organization: 'organization',
    country: 'Finland',
    password_set: new Date('2024-05-22T00:00:00.000Z'),
    used_morph: null,
    used_now: true,
    used_gene: null,
  },
}
