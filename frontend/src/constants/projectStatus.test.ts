import { describe, expect, it } from '@jest/globals'
import { projectStatusOptions, recordStatusOptions } from './projectStatus'

describe('project status constants', () => {
  it('maps the correct project status values and labels', () => {
    expect(projectStatusOptions).toEqual([
      { value: 'current', label: 'Current' },
      { value: 'no_data', label: 'No data' },
      { value: 'finished', label: 'Finished' },
    ])
  })

  it('provides boolean-backed record status options', () => {
    expect(recordStatusOptions).toEqual([
      { value: true, label: 'Public' },
      { value: false, label: 'Private' },
    ])
  })
})
