import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  listDevices: () => ipcRenderer.invoke('list-devices'),
  connectDevice: (deviceId: string) => ipcRenderer.invoke('connectDevice', deviceId),
  disconnectDevice: () => ipcRenderer.invoke('disconnectDevice'),
  installApp: (apkPath: string, deviceId: string) =>
    ipcRenderer.invoke('installApp', apkPath, deviceId),
  getDeviceInfo: (deviceId: string) => ipcRenderer.invoke('getDeviceInfo', deviceId),
  getBatteryInfo: (deviceId: string) => ipcRenderer.invoke('getBatteryInfo', deviceId),
  getInstalledApps: (deviceId: string) => ipcRenderer.invoke('getInstalledApps', deviceId),
  getAppInfo: (deviceId: string, packageName: string) =>
    ipcRenderer.invoke('getAppInfo', deviceId, packageName),
  getApkIcon: (deviceId: string, packageName: string) =>
    ipcRenderer.invoke('get-apk-icon', deviceId, packageName),
  uninstallApp: (deviceId: string, packageName: string) =>
    ipcRenderer.invoke('uninstallApp', deviceId, packageName),
  connectToRemoteDevice: (ip: string, port?: number) =>
    ipcRenderer.invoke('connectToRemoteDevice', ip, port),
  rebootDevice: (deviceId: string) => ipcRenderer.invoke('rebootDevice', deviceId),
  shutdownDevice: (deviceId: string) => ipcRenderer.invoke('shutdownDevice', deviceId),
  rebootToRecovery: (deviceId: string) => ipcRenderer.invoke('rebootToRecovery', deviceId),
  getSystemLogs: (deviceId: string) => ipcRenderer.invoke('getSystemLogs', deviceId),
  executeShellCommand: (deviceId: string, command: string) =>
    ipcRenderer.invoke('executeShellCommand', deviceId, command)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
