import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      listDevices: () => Promise<ResponseData<{ type: string; id: string }[]>>
      connectDevice: (deviceId: string) => Promise<void>
      disconnectDevice: () => Promise<void>
      installApp: (apkPath: string, deviceId: string) => Promise<ResponseData<void>>
      getDeviceInfo: (deviceId: string) => Promise<ResponseData<DeviceInfo>>
      getInstalledApps: (
        deviceId: string
      ) => Promise<
        ResponseData<{ packageName: string; installer: string; isThirdParty: boolean }[]>
      >
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

export {}
