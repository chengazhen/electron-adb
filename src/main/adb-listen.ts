import { ipcMain, app } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { Conf } from 'electron-conf/main'
import { client } from './adb-instance'
import aapt from '../../resources/aapt.exe?asset&asarUnpack'
import AdmZip from 'adm-zip'

const conf = new Conf()

const execAsync = promisify(exec)

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

// 卸载应用
ipcMain.handle('uninstallApp', async (_, packageName: string, deviceId: string) => {
  try {
    await client.uninstall(deviceId, packageName)
    return { success: true }
  } catch (err) {
    console.error('Error uninstalling app:', err)
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
      screenResolution: properties.get('ro.product.display_resolution'),
      screenSize: properties.get('ro.sf.lcd_density'),
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
    const versionMatch = appInfo.match(/versionName=(.+)/)
    const version = versionMatch ? versionMatch[1] : '未知'
    const firstInstallTimeMatch = appInfo.match(/firstInstallTime=(.+)/)
    const firstInstallTime = firstInstallTimeMatch ? firstInstallTimeMatch[1] : '未知'
    const lastUpdateTimeMatch = appInfo.match(/lastUpdateTime=(.+)/)
    const lastUpdateTime = lastUpdateTimeMatch ? lastUpdateTimeMatch[1] : '未知'

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

// 获取APK图标
ipcMain.handle('get-apk-icon', async (_, deviceId, packageName) => {
  try {
    const cachedIcon = conf.get(`${deviceId}_${packageName}_icon`)
    if (cachedIcon) {
      return cachedIcon
    }
    // 获取APK路径
    const { stdout: apkPath } = await execAsync(`adb -s ${deviceId} shell pm path ${packageName}`)
    const trimmedApkPath = apkPath.trim().replace(/^package:/, '')
    
    if (trimmedApkPath.startsWith('/vendor/app') || trimmedApkPath.startsWith('/system/app')) {
      return null
    }

    // 将APK文件拉取到临时目录
    const tempDir = path.join(app.getPath('temp'), 'apk-icons')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    const localApkPath = path.join(tempDir, `${packageName}.apk`)

    await execAsync(`adb -s ${deviceId} pull ${trimmedApkPath} ${localApkPath}`)

    const zip = new AdmZip(localApkPath)

    const { stdout: aaptInfo } = await execAsync(`${aapt} dump badging ${localApkPath}`)
    // const appNameMatch = aaptInfo.match(/application-label-zh_CN:'([^']*)'/)
    // const appName = appNameMatch ? appNameMatch[1] : '未知'



    const iconMatch = aaptInfo.match(/application-icon-[0-9]+:'([^']+)'/)
    if (iconMatch) {
      const iconPath = iconMatch[1]
      const iconBuffer = zip.getEntry(iconPath).getData()
      const iconBase64 = iconBuffer.toString('base64')
      conf.set(`${deviceId}_${packageName}_icon`, iconBase64)
      return iconBase64
    }

    return null
  } catch (error) {
    console.error('获取APK图标失败:', error)
    throw error
  }
})

// ... 其他现有的代码 ...
