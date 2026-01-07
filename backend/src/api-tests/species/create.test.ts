import { describe, it, expect, beforeAll } from '@jest/globals'
import request from 'supertest'
import app from '../../app'
import { getTestAuthToken } from '../helpers/auth'

describe('POST /api/species', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await getTestAuthToken()
  })

  it('should create a new species', async () => {
    const newSpecies = {
      species_name: 'Test species',
      genus_name: 'Test',
      specific_epithet: 'species',
      order_name: 'Carnivora',
      family_name: 'Felidae',
      subclass_or_superorder_name: 'Theria',
      class_name: 'Mammalia'
    }

    const response = await request(app)
      .post('/api/species')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newSpecies)
      .expect(201)

    expect(response.body.species_name).toEqual(newSpecies.species_name)
    expect(response.body.genus_name).toEqual(newSpecies.genus_name)
    expect(response.body.specific_epithet).toEqual(newSpecies.specific_epithet)

    // Check that locality-species are created
    const now_ls = response.body.now_ls
    expect(now_ls.length).toBeGreaterThan(0)
    const locality = now_ls.find(ls => ls.now_loc.lid === 24750)
    expect(locality).toBeDefined()
  })
})
