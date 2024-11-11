import winAapt from '../../resources/aapt2.exe?asset&asarUnpack'
import macAapt from '../../resources/aapt2?asset&asarUnpack'

export function getAapt2() {
  return process.platform === 'win32' ? winAapt : macAapt
}
