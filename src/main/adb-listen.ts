import { Client, Commands } from 'adb-ts'
import { ipcMain } from 'electron'
// ADB 功能
const client = new Client()

ipcMain.handle('list-devices', async () => {
  try {
    const devices = await client.listDevices()
    return devices
  } catch (err) {
    console.error('Error listing devices:', err)
    throw err
  }
})

// 安装应用
ipcMain.handle('installApp', async (_, apkPath: string, deviceId: string) => {
  try {
    await client.install(deviceId, apkPath)
    return { success: true }
  } catch (err) {
    console.error('Error installing app:', err)
    throw err
  }
})

// 获取设备信息
// 获取设备信息
ipcMain.handle('getDeviceInfo', async (event, deviceId: string) => {
  try {
    try {
      // const batteryLevel = await client.execDevice(deviceId, 'shell dumpsys battery | grep level');
      // const model = await client.execDevice(deviceId, 'shell getprop ro.product.model');
      // return {
      //   batteryLevel: parseInt(batteryLevel.split(':')[1].trim()),
      //   model: model.trim()
      // }
      const serial = await client.getSerialNo(deviceId)
      // const batteryLevel = await client.execDevice(deviceId, 'shell dumpsys battery | grep level');
      const batteryLevel = await client.exec('shell dumpsys battery') // Adjusted command
      // Process batteryLevel to extract the level
      const levelMatch = batteryLevel.match(/level:\s*(\d+)/)
      return {
        batteryLevel: levelMatch ? parseInt(levelMatch[1]) : null
        // model: model.trim()
      }
    } catch (error) {
      console.error('Error fetching device info:', error)
      throw new Error('Failed to fetch device information')
    }
  } catch (err) {
    console.error('Error getting device info:', err)
    throw err
  }
})
