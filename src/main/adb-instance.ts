import { Client } from 'adb-ts'

import bin from '../../resources/platform-tools/adb.exe?asset&asarUnpack'

// ADB 功能
const client = new Client({
  bin: process.platform === 'win32' ? bin : undefined
})

export { client }
