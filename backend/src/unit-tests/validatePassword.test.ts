import { describe, it, expect } from '@jest/globals'
import { validatePassword } from '../utils/validatePassword'

describe('Password validation utils', () => {
  it('Accepts correct password', () => {
    expect(validatePassword('thisisavalidpassword').isValid).toBeTruthy()
  })
  it('Accepts correct password with symbols', () => {
    expect(validatePassword('thisisav~!%ali&dpas$sword').isValid).toBeTruthy()
  })
  it('Rejects invalid password with unsupported symbols in the middle', () => {
    expect(validatePassword('thisisav~%a€li&dpas$sword').isValid).toBeFalsy()
  })
  it('Rejects invalid password with unsupported symbols in the beginning or end', () => {
    expect(validatePassword('thisisav~%ali&dpas$sword€').isValid).toBeFalsy()
    expect(validatePassword('€thisisav~%ali&dpas$sword').isValid).toBeFalsy()
  })
  it('Rejects password that is under 8 characters', () => {
    expect(validatePassword('aaaaaaa').isValid).toBeFalsy()
    expect(validatePassword('aaaaa').isValid).toBeFalsy()
  })
  it('Accepts password that is 8 characters or more', () => {
    expect(validatePassword('aaaaaaaa').isValid).toBeTruthy()
    expect(validatePassword('aaaaaaaaaaaa').isValid).toBeTruthy()
  })
})
