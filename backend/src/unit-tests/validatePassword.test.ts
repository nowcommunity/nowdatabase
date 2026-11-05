import { describe, it, expect } from '@jest/globals'
import { validatePassword } from '../utils/validatePassword'

describe('Password validation utils', () => {
  it('Accepts correct password', () => {
    expect(validatePassword('thisIsAvalidpassword1!').isValid).toBeTruthy()
  })
  it('Accepts correct password with symbols', () => {
    expect(validatePassword('thisIsav~!%ali&dpas$sw0rd').isValid).toBeTruthy()
  })
  it('Accepts generated password symbols', () => {
    expect(validatePassword('Valid^password1').isValid).toBeTruthy()
    expect(validatePassword('Valid?password1').isValid).toBeTruthy()
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
    expect(validatePassword('aaaaaA1!').isValid).toBeTruthy()
    expect(validatePassword('aaaaaaaaaaaA1!').isValid).toBeTruthy()
  })
  it('Rejects password missing a character class', () => {
    expect(validatePassword('12345678').isValid).toBeFalsy()
    expect(validatePassword('ABCDEFG1!').isValid).toBeFalsy()
    expect(validatePassword('abcdefg1!').isValid).toBeFalsy()
    expect(validatePassword('abcdefgA!').isValid).toBeFalsy()
    expect(validatePassword('abcdefgA1').isValid).toBeFalsy()
  })
})
