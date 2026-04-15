import { nowDb } from '../utils/db'
import { EditDataType, EditMetaData, RegionCoordinator, RegionDetails } from '../../../frontend/src/shared/types'
import { validateRegion } from '../../../frontend/src/shared/validators/region'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import Prisma from '../../prisma/generated/now_test_client'

export const getAllRegions = async () => {
  const result = await nowDb.now_reg_coord.findMany({})
  return result
}

export const getRegionDetails = async (id: number) => {
  // TODO: Check if user has access

  const result = await nowDb.now_reg_coord.findUnique({
    where: { reg_coord_id: id },
    include: {
      now_reg_coord_country: {},
      now_reg_coord_people: {
        include: {
          com_people: true,
        },
      },
    },
  })
  return result
}

const validateRegionCoordinatorInitialsExist = async (
  coordinators: EditDataType<RegionCoordinator[]>
): Promise<ValidationObject | null> => {
  const uniqueInitials = Array.from(
    new Set(
      coordinators
        .filter(coordinator => coordinator.rowState !== 'removed' && coordinator.rowState !== 'cancelled')
        .map(coordinator => (typeof coordinator.initials === 'string' ? coordinator.initials.trim() : ''))
        .filter(Boolean)
    )
  )

  if (uniqueInitials.length === 0) return null

  const existingPeople = await nowDb.com_people.findMany({
    where: { initials: { in: uniqueInitials } },
    select: { initials: true },
  })
  const existingInitials = new Set(existingPeople.map(p => p.initials))

  const missing = uniqueInitials.filter(initials => !existingInitials.has(initials))
  if (missing.length === 0) return null

  return {
    name: 'Region Coordinators',
    error: `Coordinator initials not found: ${missing.join(', ')}`,
  }
}

export const validateEntireRegion = async (editedFields: EditDataType<Prisma.now_reg_coord> & EditMetaData) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateRegion(editedFields as EditDataType<RegionDetails>, key as keyof RegionDetails)
    if (error.error) errors.push(error)
  }

  if ('now_reg_coord_people' in editedFields && editedFields.now_reg_coord_people) {
    const coordinatorError = await validateRegionCoordinatorInitialsExist(
      editedFields.now_reg_coord_people as EditDataType<RegionCoordinator[]>
    )
    if (coordinatorError) errors.push(coordinatorError)
  }

  return errors
}
