import { Sentry } from 'react-native-sentry'

export class DataError extends Error {
  constructor (message) {
    super(message)
    this.name = 'DataError'
    this.message = message
  }
}

// This function is to filter out unwanted Sentry Logs
const errorFilter = (e) => {
  // This error only occur at SCAN PAYMENT
  if (e.name === 'SyntaxError') return false
  // This error is tricky to be spotte but only occur when user try input a wrong PIN
  if (e.message.includes('Unable to open a realm at path')) return false
  return true
}
export const logSentry = (e, module = 'App') => (
  errorFilter(e) && Sentry.captureException(e, { logger: module })
)
