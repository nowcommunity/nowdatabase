import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllSpecies = async (onlyPublic: boolean) => {
  const where = onlyPublic ? { sp_status: false } : {}

  const result = await prisma.com_species.findMany({
    select: {
      species_id: true,
      subclass_or_superorder_name: true,
      order_name: true,
      suborder_or_superfamily_name: true,
      family_name: true,
      subfamily_name: true,
      genus_name: true,
      species_name: true,
      unique_identifier: true,
      sp_status: true,
    },
    where,
  })

  return result
}

export const getSpeciesDetailsx = async (id: number) => {
  // TODO: Check if user has access
  const result = await prisma.com_species.findUnique({ where: { species_id: id } })
  return result
}

export const getSpeciesDetails = async (id: number) => {
  // TODO: Check if user has access

  const result = await prisma.com_species.findUnique({
    where: { species_id: id },
    include: {
      now_ls: {
        include: {
          now_loc: true,
        },
      },
      com_taxa_synonym: {},
      now_sau: {
        include: {
          now_sr: true,
        },
      },
    },
  })

  if (!result) return null
  return result
}
