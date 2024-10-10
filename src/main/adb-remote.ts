import { ipcMain } from 'electron'
import { client } from './adb-instance'

// 断开设备
ipcMain.handle('disconnectDevice', async (_, host: string) => {
  try {
    await client.disconnect(host)
    return { success: true }
  } catch (err) {
    console.error('Error disconnecting device:', err)
    throw err
  }
})

// 链接设备
ipcMain.handle('connectDevice', async (_, host: string) => {
  try {
    await client.connect(host)
    return { success: true }
  } catch (err) {
    console.error('Error connecting device:', err)
    throw err
  }
})