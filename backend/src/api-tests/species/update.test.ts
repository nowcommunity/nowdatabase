import request from 'supertest'
import app from '../../app'
import { createTestUser, getAuthToken, cleanupTestUser } from '../helpers/userHelpers'

describe('Species Update API Tests', () => {
  let authToken: string
  let testUserId: string

  beforeAll(async () => {
    const { user, token } = await createTestUser('speciesupdatetest')
    testUserId = user.id
    authToken = token
  })

  afterAll(async () => {
    await cleanupTestUser(testUserId)
  })

  describe('PUT /api/species/:id', () => {
    it('should update a species successfully', async () => {
      // First create a species
      const newSpecies = {
        genus_name: 'TestGenus',
        species_name: 'testspecies',
        unique_identifier: 'TestGenus testspecies',
        taxonomic_status: 'valid',
        common_name: 'Test Species'
      }

      const createResponse = await request(app)
        .post('/api/species')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newSpecies)

      expect(createResponse.status).toBe(201)
      const speciesId = createResponse.body.id

      // Update the species
      const updateData = {
        genus_name: 'UpdatedGenus',
        species_name: 'updatedspecies',
        unique_identifier: 'UpdatedGenus updatedspecies',
        taxonomic_status: 'valid',
        common_name: 'Updated Test Species'
      }

      const updateResponse = await request(app)
        .put(`/api/species/${speciesId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)

      expect(updateResponse.status).toBe(200)
      expect(updateResponse.body.genus_name).toBe('UpdatedGenus')
      expect(updateResponse.body.species_name).toBe('updatedspecies')
      expect(updateResponse.body.common_name).toBe('Updated Test Species')
    })

    it('should return 404 for non-existent species', async () => {
      const updateData = {
        genus_name: 'UpdatedGenus',
        species_name: 'updatedspecies',
        unique_identifier: 'UpdatedGenus updatedspecies',
        taxonomic_status: 'valid'
      }

      const response = await request(app)
        .put('/api/species/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)

      expect(response.status).toBe(404)
    })

    it('should return 400 for invalid data', async () => {
      // First create a species
      const newSpecies = {
        genus_name: 'TestGenus2',
        species_name: 'testspecies2',
        unique_identifier: 'TestGenus2 testspecies2',
        taxonomic_status: 'valid'
      }

      const createResponse = await request(app)
        .post('/api/species')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newSpecies)

      expect(createResponse.status).toBe(201)
      const speciesId = createResponse.body.id

      // Try to update with invalid data (missing required field)
      const invalidData = {
        genus_name: 'UpdatedGenus',
        species_name: 'updatedspecies'
        // Missing unique_identifier
      }

      const response = await request(app)
        .put(`/api/species/${speciesId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)

      expect(response.status).toBe(400)
    })

    it('should return 401 when not authenticated', async () => {
      const updateData = {
        genus_name: 'UpdatedGenus',
        species_name: 'updatedspecies',
        unique_identifier: 'UpdatedGenus updatedspecies',
        taxonomic_status: 'valid'
      }

      const response = await request(app)
        .put('/api/species/1')
        .send(updateData)

      expect(response.status).toBe(401)
    })

    it('should not allow duplicate taxon names', async () => {
      // Create first species
      const species1 = {
        genus_name: 'DuplicateGenus',
        species_name: 'duplicatespecies',
        unique_identifier: 'DuplicateGenus duplicatespecies',
        taxonomic_status: 'valid'
      }

      const create1Response = await request(app)
        .post('/api/species')
        .set('Authorization', `Bearer ${authToken}`)
        .send(species1)

      expect(create1Response.status).toBe(201)
      const species1Id = create1Response.body.id

      // Create second species with different name
      const species2 = {
        genus_name: 'DifferentGenus',
        species_name: 'differentspecies',
        unique_identifier: 'DifferentGenus differentspecies',
        taxonomic_status: 'valid'
      }

      const create2Response = await request(app)
        .post('/api/species')
        .set('Authorization', `Bearer ${authToken}`)
        .send(species2)

      expect(create2Response.status).toBe(201)
      const species2Id = create2Response.body.id

      // Try to update species2 to have the same name as species1
      const duplicateUpdate = await request(app)
        .put(`/api/species/${species2Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(species1)

      expect(duplicateUpdate.status).toBe(400)
      expect(duplicateUpdate.body.some(error => error.error === 'The taxon already exists in the database.')).toEqual(true)
    })
  })
})
