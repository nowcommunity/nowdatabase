import { useCallback, useMemo } from 'react'

export interface PasswordValidationResult {
  isValid: boolean
  error?: string
}

const passwordRequirements = [
  'Password must be at least 8 characters long',
  'Password must only contain characters a-z, A-Z, 0-9 and ^?$%&~!',
]

export const usePasswordValidation = () => {
  const requirements = useMemo(() => passwordRequirements, [])

  const validatePassword = useCallback(
    (password: string): PasswordValidationResult => {
      if (password.length < 8) {
        return { isValid: false, error: requirements[0] }
      }

      if (!/^[0-9A-Za-z$%&~!]+$/.test(password)) {
        return { isValid: false, error: requirements[1] }
      }

      return { isValid: true }
    },
    [requirements]
  )

  return { passwordRequirements: requirements, validatePassword }
}
