import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      listDevices: () => Promise<{ type: string; id: string }[]>
      connectDevice: (deviceId: string) => Promise<void>
      disconnectDevice: () => Promise<void>
      installApp: (apkPath: string, deviceId: string) => Promise<void>
      uninstallApp: () => Promise<void>
      getDeviceInfo: (deviceId: string) => Promise<{
        model: string
        androidVersion: string
        serialNumber: string
        batteryLevel: number
        screenResolution: string
      }>
    }
  }
}
