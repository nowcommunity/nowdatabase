import { describe, expect, it, jest } from '@jest/globals'
import type { NextFunction, Request, Response } from 'express'

import { maintenanceGate } from '../../middlewares/maintenanceGate'
import { getMaintenanceState } from '../../utils/maintenanceMode'

jest.mock('../../utils/maintenanceMode', () => ({
  getMaintenanceState: jest.fn(),
}))

const mockedGetMaintenanceState = jest.mocked(getMaintenanceState)

type ResponseDouble = {
  status: jest.MockedFunction<(code: number) => ResponseDouble>
  json: jest.MockedFunction<(body: unknown) => ResponseDouble>
}

const createResponse = () => {
  const res = {} as ResponseDouble
  res.status = jest.fn((_code: number) => res) as unknown as ResponseDouble['status']
  res.json = jest.fn((_body: unknown) => res) as unknown as ResponseDouble['json']

  return res
}

describe('maintenanceGate', () => {
  it('allows requests when maintenance is disabled', () => {
    mockedGetMaintenanceState.mockReturnValueOnce({ enabled: false, enabledAt: null, reason: null, enabledBy: null })

    const req = { method: 'GET', path: '/locality/all' } as unknown as Request
    const res = createResponse()
    const next = jest.fn() as unknown as NextFunction

    maintenanceGate(req, res as unknown as Response, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('blocks non-allowlisted routes with 503 when maintenance is enabled', () => {
    mockedGetMaintenanceState.mockReturnValueOnce({
      enabled: true,
      enabledAt: '2026-04-17T00:00:00.000Z',
      reason: 'db corrupted',
      enabledBy: 'TEST',
    })

    const req = { method: 'GET', path: '/locality/all' } as unknown as Request
    const res = createResponse()
    const next = jest.fn() as unknown as NextFunction

    maintenanceGate(req, res as unknown as Response, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith({
      maintenance: true,
      enabledAt: '2026-04-17T00:00:00.000Z',
      reason: 'db corrupted',
    })
  })

  it('allows allowlisted routes during maintenance', () => {
    mockedGetMaintenanceState.mockReturnValueOnce({
      enabled: true,
      enabledAt: '2026-04-17T00:00:00.000Z',
      reason: null,
      enabledBy: null,
    })

    const req = { method: 'GET', path: '/version' } as unknown as Request
    const res = createResponse()
    const next = jest.fn() as unknown as NextFunction

    maintenanceGate(req, res as unknown as Response, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('allows OPTIONS preflight during maintenance', () => {
    mockedGetMaintenanceState.mockReturnValueOnce({
      enabled: true,
      enabledAt: '2026-04-17T00:00:00.000Z',
      reason: 'db corrupted',
      enabledBy: 'TEST',
    })

    const req = { method: 'OPTIONS', path: '/locality/all' } as unknown as Request
    const res = createResponse()
    const next = jest.fn() as unknown as NextFunction

    maintenanceGate(req, res as unknown as Response, next)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
