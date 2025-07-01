export interface PasswordValidationResult {
  error?: string
  isValid: boolean
}

export const validatePassword = (password: string): PasswordValidationResult => {
  if (password.length < 8) return { isValid: false, error: 'Password must be at least 8 characters long' }
  if (!/^[0-9A-Za-z$%&~!]+$/.test(password))
    return {
      isValid: false,
      error: 'Password must only contain characters a-z, A-Z, 0-9 and ^?$%&~!',
    }

  return { isValid: true }
}
