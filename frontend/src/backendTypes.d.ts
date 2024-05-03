import Prisma from '../../backend/node_modules/@prisma/client/default'

type LocalityDetails = Prisma.now_loc

type Locality = {
  lid: number;
  loc_name: string;
  max_age: number;
  min_age: number;
  country: string | null;
  loc_status: boolean | null;
}

type SpeciesDetails = Prisma.com_species

type Species = {
  species_id: number;
  order_name: string;
  family_name: string;
  subclass_or_superorder_name: string | null;
  suborder_or_superfamily_name: string | null;
  subfamily_name: string | null;
  genus_name: string;
  species_name: string;
  unique_identifier: string;
  sp_status: boolean | null;
}
