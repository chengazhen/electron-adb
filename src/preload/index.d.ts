import { ElectronAPI } from '@electron-toolkit/preload'

export type DeviceInfo = {
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
  manufacturer: string
  totalStorage: string
  usedStorage: string
  availableStorage: string
  totalMemoryGB: string
  availableMemoryGB: string
  usedMemoryGB: string
  marketingName: string
  isWifiEnabled: boolean
  currentWifi: string
}

interface ResponseData<T> {
  success: boolean
  data: T | null
  error: string | null
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      listDevices: () => Promise<ResponseData<{ type: string; id: string }[]>>
      connectDevice: (deviceId: string) => Promise<void>
      disconnectDevice: () => Promise<void>
      installApp: (apkPath: string, deviceId: string) => Promise<void>
      getDeviceInfo: (deviceId: string) => Promise<ResponseData<DeviceInfo>>
      getInstalledApps: (deviceId: string) => Promise<ResponseData<string[]>>
      getAppInfo: (
        deviceId: string,
        packageName: string
      ) => Promise<
        ResponseData<{
          version: string
          name: string
          firstInstallTime: string
          lastUpdateTime: string
        }>
      >
      getApkIcon: (
        deviceId: string,
        packageName: string
      ) => Promise<ResponseData<{ icon: string; name: string }>>
      uninstallApp: (deviceId: string, packageName: string) => Promise<ResponseData<void>>
    }
  }
}
