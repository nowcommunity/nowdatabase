import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TestLocalityData {
  lid?: number;
  loc_name?: string;
  max_age?: number;
  min_age?: number;
  frac_max_age?: number;
  frac_min_age?: number;
  chron?: string;
  basin?: string;
  subbasin?: string;
  country?: string;
  state?: string;
  county?: string;
  site_area?: number;
  gen_loc?: string;
  approx_coord?: number;
  dec_lat?: number;
  dec_long?: number;
  altitude?: number;
  nut_code?: string;
  bfa_min?: string;
  bfa_max?: string;
  frac_bfa_min?: string;
  frac_bfa_max?: string;
  est_age?: number;
  sed_details?: string;
}

/**
 * Create a test locality with the provided data
 * @param data - Partial locality data to create
 * @returns Created locality object
 */
export async function createTestLocality(data: TestLocalityData = {}) {
  const defaultData: TestLocalityData = {
    loc_name: `Test Locality ${Date.now()}`,
    max_age: 10.0,
    min_age: 5.0,
    country: 'Test Country',
    dec_lat: 40.7128,
    dec_long: -74.0060,
    ...data,
  };

  const locality = await prisma.locality.create({
    data: defaultData,
  });

  return locality;
}

/**
 * Update a test locality with new data
 * @param lid - Locality ID to update
 * @param data - Data to update
 * @returns Updated locality object
 */
export async function updateTestLocality(lid: number, data: TestLocalityData) {
  const locality = await prisma.locality.update({
    where: { lid },
    data,
  });

  return locality;
}

/**
 * Delete a test locality by ID
 * @param lid - Locality ID to delete
 * @returns Deleted locality object
 */
export async function deleteTestLocality(lid: number) {
  const locality = await prisma.locality.delete({
    where: { lid },
  });

  return locality;
}

/**
 * Delete multiple test localities by IDs
 * @param lids - Array of locality IDs to delete
 * @returns Count of deleted localities
 */
export async function deleteTestLocalities(lids: number[]) {
  const result = await prisma.locality.deleteMany({
    where: {
      lid: {
        in: lids,
      },
    },
  });

  return result;
}

/**
 * Clean up all test localities (localities with names starting with "Test Locality")
 * Use with caution - only for test cleanup
 */
export async function cleanupTestLocalities() {
  const result = await prisma.locality.deleteMany({
    where: {
      loc_name: {
        startsWith: 'Test Locality',
      },
    },
  });

  return result;
}
