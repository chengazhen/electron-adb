import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  listDevices: () => ipcRenderer.invoke('list-devices'),
  connectDevice: (deviceId: string) => ipcRenderer.invoke('connectDevice', deviceId),
  disconnectDevice: () => ipcRenderer.invoke('disconnectDevice'),
  installApp: () => ipcRenderer.invoke('installApp'),
  uninstallApp: () => ipcRenderer.invoke('uninstallApp')
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
