// get decimal part by converting to string to avoid false precision
const getDecimalPart = (value: number) => {
  const stringValue = String(value)
  const index = stringValue.indexOf('.')
  return Number('0.' + (index > -1 ? stringValue.substring(index + 1) : '0'))
}

export const convertDecToDms = (dec: number | null | undefined, isLatitude: boolean) => {
  if (typeof dec !== 'number') return undefined

  const max_degrees = isLatitude ? 90 : 180

  const dec_absolute = Math.abs(dec)
  if (dec_absolute > max_degrees) return undefined

  const degrees = Math.floor(dec_absolute)
  const minutesNotTruncated = getDecimalPart(dec_absolute) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = Math.floor(getDecimalPart(minutesNotTruncated) * 60)

  let direction = ''
  if (isLatitude) {
    direction = dec >= 0 ? 'N' : 'S'
  } else {
    direction = dec >= 0 ? 'E' : 'W'
  }

  return degrees + ' ' + minutes + ' ' + seconds + ' ' + direction
}

export const convertDmsToDec = (dms: string | null | undefined, isLatitude: boolean) => {
  if (typeof dms !== 'string') return undefined

  const dmsRegEx = /^(\d{1,3}) (\d{1,2}) (\d{1,2}) ([NSEW])$/
  if (!dmsRegEx.test(dms)) return undefined

  const dmsArray = dms.split(' ')
  if (dmsArray.length != 4) return undefined

  const degrees = Number(dmsArray[0])
  const minutes = Number(dmsArray[1])
  const seconds = Number(dmsArray[2])
  const direction = dmsArray[3]

  if (isLatitude) {
    if (direction !== 'N' && direction !== 'S') return undefined
  } else {
    if (direction !== 'E' && direction !== 'W') return undefined
  }

  let dec = Number((degrees + minutes / 60 + seconds / 3600).toFixed(12))

  const max_dec = isLatitude ? 90 : 180
  if (dec > max_dec) return undefined

  if (direction == 'S' || direction == 'W') {
    dec = dec * -1
  }

  return dec
}
