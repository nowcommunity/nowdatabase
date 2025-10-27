import { readFileSync } from 'fs'
import path from 'path'

const csvPath = path.resolve(__dirname, '../../..', 'data', 'countryContinentMap.csv')
const csvContent = readFileSync(csvPath, 'utf8')

export default csvContent
