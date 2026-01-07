import type { PrismaClient } from '@prisma/client';
import { testPrisma as prisma } from './prisma';

export const createLocality = async (
  localityData?: Parameters<PrismaClient['locality']['create']>[0]['data']
) => {
  return prisma.locality.create({
    data: localityData ?? {
      loc_name: 'Test Locality',
      country: 'Test Country',
    },
  });
};

export const deleteLocality = async (id: number) => {
  return prisma.locality.delete({
    where: { lid: id },
  });
};

export const cleanupLocalities = async () => {
  return prisma.locality.deleteMany({});
};
