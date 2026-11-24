import { describe, expect, it, jest } from '@jest/globals'
import { TtlCache } from '../../services/utils/ttlCache'

describe('TtlCache', () => {
  it('reuses a loaded value and shares concurrent loads', async () => {
    const cache = new TtlCache<number>(1000, 4)
    const load = jest.fn(() => Promise.resolve(1))

    const [first, second] = await Promise.all([cache.get('a', load), cache.get('a', load)])
    await cache.get('a', load)

    expect([first, second]).toEqual([1, 1])
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('reloads after invalidation', async () => {
    const cache = new TtlCache<number>(1000, 4)
    const load = jest.fn(() => Promise.resolve(1))

    await cache.get('a', load)
    cache.invalidate()
    await cache.get('a', load)

    expect(load).toHaveBeenCalledTimes(2)
  })

  it('does not store a load that was started before an invalidation', async () => {
    const cache = new TtlCache<number>(1000, 4)
    let resolveLoad: (value: number) => void = () => {}
    const slowLoad = () => new Promise<number>(resolve => (resolveLoad = resolve))
    const load = jest.fn(() => Promise.resolve(2))

    const pending = cache.get('a', slowLoad)
    cache.invalidate()
    resolveLoad(1)
    await pending
    await cache.get('a', load)

    expect(load).toHaveBeenCalledTimes(1)
  })

  it('does not keep failed loads and evicts the oldest entries', async () => {
    const cache = new TtlCache<number>(1000, 1)
    await expect(cache.get('a', () => Promise.reject(new Error('fail')))).rejects.toThrow('fail')
    const load = jest.fn(() => Promise.resolve(1))

    await cache.get('a', load)
    await cache.get('b', load)
    await cache.get('a', load)

    expect(load).toHaveBeenCalledTimes(3)
  })
})
