const genericErrorMessage = 'An unexpected navigation error occurred.'

export const getRouterErrorMessage = (error: unknown, isDevelopment: boolean): string => {
  if (!isDevelopment) {
    return genericErrorMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  if (error instanceof Response) {
    return `${error.status} ${error.statusText}`
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unknown error occurred'
}
