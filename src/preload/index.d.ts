import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      listDevices: () => Promise<{ type: string; id: string }[]>
      connectDevice: (deviceId: string) => Promise<void>
      disconnectDevice: () => Promise<void>
      installApp: (apkPath: string, deviceId: string) => Promise<void>
      getDeviceInfo: (deviceId: string) => Promise<{
        batteryInfo: {
          level: number
          acPowered: boolean
          usbPowered: boolean
          wirelessPowered: boolean
          maxChargingCurrent: number
          maxChargingVoltage: number
          chargeCounter: number
          status: number
          health: number
          present: boolean
          scale: number
          voltage: number
          temperature: number
          technology: string
        }
        serialNumber: string
        screenResolution: string
        screenSize: string
        model: string
        androidVersion: string
      }>
      getInstalledApps: (deviceId: string) => Promise<string[]>
      getAppInfo: (
        deviceId: string,
        packageName: string
      ) => Promise<{
        version: string
        name: string
        firstInstallTime: string
        lastUpdateTime: string
      }>
      getApkIcon: (deviceId: string, packageName: string) => Promise<string>
      uninstallApp: (deviceId: string, packageName: string) => Promise<void>
    }
  }
}
