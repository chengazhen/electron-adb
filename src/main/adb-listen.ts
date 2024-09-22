import { Client} from 'adb-ts'
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
ipcMain.handle('getDeviceInfo', async (_, deviceId: string) => {
  try {
    const properties = await client.listProperties(deviceId)
    const batteryStatus = await client.batteryStatus(deviceId)
    console.log(batteryStatus)

    return {
      batteryInfo: {
        level: batteryStatus.get('level'),
        acPowered: batteryStatus.get('AC powered'),
        usbPowered: batteryStatus.get('USB powered'),
        wirelessPowered: batteryStatus.get('Wireless powered'),
        maxChargingCurrent: batteryStatus.get('Max charging current'),
        maxChargingVoltage: batteryStatus.get('Max charging voltage'),
        chargeCounter: batteryStatus.get('Charge counter'),
        status: batteryStatus.get('status'),
        health: batteryStatus.get('health'),
        present: batteryStatus.get('present'),
        scale: batteryStatus.get('scale'),
        voltage: batteryStatus.get('voltage'),
        temperature: batteryStatus.get('temperature'),
        technology: batteryStatus.get('technology')
      },
      serialNumber: properties.get('ro.serialno'),
      screenResolution: properties.get('ro.sf.lcd_density'),
      model: properties.get('ro.product.model'),
      androidVersion: properties.get('ro.build.version.release')
    }
  } catch (error) {
    console.error('Error fetching device info:', error)
    throw new Error('Failed to fetch device information')
  }
})

// 判断当前环境是否为windows
ipcMain.handle('getPlatform', async () => {
  try {
    const platform = process.platform
    return { platform }
  } catch (err) {
    console.error('Error checking platform:', err)
    throw err
  }
})

// 获取已安装应用列表
ipcMain.handle('getInstalledApps', async (_, deviceId: string) => {
  try {
    const packages = await client.listPackages(deviceId)
    return packages
  } catch (err) {
    console.error('Error fetching installed apps:', err)
    throw err
  }
})

// 获取应用信息
ipcMain.handle('getAppInfo', async (_, deviceId: string, packageName: string) => {
  try {
    const appInfo = await client.shell(deviceId, `dumpsys package ${packageName}`)
    const versionMatch = appInfo.match(/versionName=(.+)/);
    const version = versionMatch ? versionMatch[1] : '未知';
    const firstInstallTimeMatch =  appInfo.match(/firstInstallTime=(.+)/);
    const firstInstallTime = firstInstallTimeMatch ? firstInstallTimeMatch[1] : '未知';
    const lastUpdateTimeMatch = appInfo.match(/lastUpdateTime=(.+)/);
    const lastUpdateTime = lastUpdateTimeMatch ? lastUpdateTimeMatch[1] : '未知';

    

    return {
      version: version,
      name: packageName,
      firstInstallTime: firstInstallTime,
      lastUpdateTime: lastUpdateTime
    }
  } catch (err) {
    console.error('Error fetching app info:', err)
    throw err
  }
})

// 检查是否安装了ADB