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
      connectToRemoteDevice: (ip: string, port?: number) => Promise<ResponseData<string>>
      rebootDevice: (deviceId: string) => Promise<ResponseData<void>>
      shutdownDevice: (deviceId: string) => Promise<ResponseData<void>>
      rebootToRecovery: (deviceId: string) => Promise<ResponseData<void>>
      getSystemLogs: (deviceId: string) => Promise<ResponseData<string>>
    }
  }
}

export {}
