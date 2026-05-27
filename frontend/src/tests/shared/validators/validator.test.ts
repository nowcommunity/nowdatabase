import { describe, expect, it } from '@jest/globals'

import { validateTimeBoundFields } from '@/shared/validators/timeBound'
import { validateFields, type Validators } from '@/shared/validators/validator'

type TestData = {
  id?: number
  requiredName?: string
  optionalComment?: string | null
}

describe('validateFields', () => {
  const validators: Validators<Partial<TestData>> = {
    requiredName: {
      name: 'Required name',
      required: true,
    },
    optionalComment: {
      name: 'Optional comment',
    },
  }

  it('runs validators for configured fields missing from editData', () => {
    const errors = validateFields<TestData>(validators, {})

    expect(errors).toEqual([{ name: 'Required name', error: 'This field is required' }])
  })

  it('allows callers to validate a focused field list', () => {
    const errors = validateFields<TestData>(validators, {}, ['optionalComment'])

    expect(errors).toEqual([])
  })
})

describe('validateTimeBoundFields', () => {
  it('reports missing required fields', () => {
    const errors = validateTimeBoundFields({})

    expect(errors).toEqual([
      { name: 'Name', error: 'This field is required' },
      { name: 'Age (Ma)', error: 'This field is required' },
    ])
  })
})
