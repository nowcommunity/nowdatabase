/* eslint-disable no-console */
const getLogString = (msg: string) => [new Date().toLocaleTimeString('FI-fi'), msg].join(' ')

const info = (msg: string) => {
  console.log(getLogString(msg))
}

const error = (msg: string) => {
  console.error(getLogString(msg))
}

export default { info, error }
