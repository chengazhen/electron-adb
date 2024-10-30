/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain, app } from 'electron'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { Conf } from 'electron-conf/main'
import { client } from './adb-instance'
import aapt from '../../resources/aapt.exe?asset&asarUnpack'
import AdmZip from 'adm-zip'
import { getMarketingName } from './csv-reader'
import { handleResponse } from './responseHandler'
import Utils from './utils'

const conf = new Conf()
const utils = new Utils(client)
const execAsync = promisify(exec)

ipcMain.handle(
  'list-devices',
  handleResponse(async () => {
    const devices = await client.listDevices()
    return devices
  })
)

// 安装应用
ipcMain.handle(
  'installApp',
  handleResponse(async (_, apkPath: string, deviceId: string) => {
    await client.install(deviceId, apkPath)
    return { message: 'App installed successfully' }
  })
)

// 卸载应用
ipcMain.handle(
  'uninstallApp',
  handleResponse(async (_, deviceId: string, packageName: string) => {
    await client.uninstall(deviceId, packageName)
    return { message: 'App uninstalled successfully' }
  })
)

// 获取设备信息
ipcMain.handle(
  'getDeviceInfo',
  handleResponse(async (_, deviceId: string) => {
    try {
      const properties = await utils.getProperties(deviceId)
      const batteryStatus = await client.batteryStatus(deviceId)
      // 获取储存信息
      const {
        total: totalStorage,
        used: usedStorage,
        available: availableStorage
      } = await utils.storageInfo(deviceId)

      const model = await utils.modelName(deviceId)
      const marketingName = getMarketingName(model)

      // 获取运行内存使用情况
      const {
        total: totalMemoryGB,
        available: availableMemoryGB,
        used: usedMemoryGB
      } = await utils.memoryInfo(deviceId)

      // 获取WiFi状态
      const wifiStatus = await client.shell(deviceId, 'dumpsys wifi | grep "Wi-Fi is"')
      const isWifiEnabled = wifiStatus.includes('Wi-Fi is enabled')

      const currentWifi = await utils.ssidName(deviceId)
      const deviceName = await utils.deviceName(deviceId)

      const wifiIpAddress = await utils.getWifiIpAddress(deviceId)

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
        manufacturer: properties.get('ro.product.manufacturer'),
        serialNumber: properties.get('ro.serialno'),
        screenResolution: properties.get('ro.product.display_resolution'),
        screenSize: properties.get('ro.sf.lcd_density'),
        model,
        marketingName: marketingName,
        androidVersion: properties.get('ro.build.version.release'),
        totalStorage: totalStorage,
        usedStorage: usedStorage,
        availableStorage: availableStorage,
        totalMemoryGB,
        availableMemoryGB,
        usedMemoryGB,
        isWifiEnabled,
        currentWifi,
        deviceName,
        wifiIpAddress
      }
    } catch (error) {
      console.error('Error fetching device info:', error)
      throw new Error('Failed to fetch device information')
    }
  })
)

// 判断当前环境是否为windows
ipcMain.handle(
  'getPlatform',
  handleResponse(async () => {
    return { platform: process.platform }
  })
)

// 获取已安装应用列表
ipcMain.handle(
  'getInstalledApps',
  handleResponse(async (_, deviceId: string) => {
    const packages = await client.shell(deviceId, 'pm list packages -i')
    const thirdPartyAppStr = await client.shell(deviceId, 'pm list packages -3')
    const thirdPartyApps = thirdPartyAppStr.split('\n')
    return packages.split('\n').map((line) => {
      const packageName = line.replace('package:', '').split(' ')[0]
      return {
        packageName,
        installer: formatInstaller(line.split('installer=')[1]),
        isThirdParty: thirdPartyApps.some((app) => app.includes(packageName))
      }
    })
  })
)

function formatInstaller(installer: string) {
  if (installer === 'null') {
    return '系统'
  }
  return installer
}

// 获取应用信息
ipcMain.handle(
  'getAppInfo',
  handleResponse(async (_, deviceId: string, packageName: string) => {
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
)

// 获取APK图标
ipcMain.handle(
  'get-apk-icon',
  handleResponse(async (_, deviceId, packageName) => {
    try {
      const cachedIcon = conf.get(`${deviceId}_${packageName}_icon`)
      if (cachedIcon) {
        return cachedIcon
      }

      // 获取APK路径
      const apkPath = await client.shell(deviceId, `pm path ${packageName}`)
      const trimmedApkPath = apkPath.trim().replace(/^package:/, '')

      // 将APK文件拉取到临时目录
      const tempDir = path.join(app.getPath('temp'), 'apk-icons')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }
      const localApkPath = path.join(tempDir, `${packageName}.apk`)

      // 判断本地是否已经有了APK文件
      await client.pullFile(deviceId, trimmedApkPath, localApkPath)

      const { stdout: aaptInfo } = await execAsync(`${aapt} dump badging ${localApkPath}`)
      const zhMatch = aaptInfo.match(/application-label-zh_CN:'([^']*)'/)
      const enMatch = aaptInfo.match(/application-label:'([^']*)'/)
      const appName = zhMatch ? zhMatch[1] : enMatch ? enMatch[1] : packageName

      const iconMatch = aaptInfo.match(/application-icon-[0-9]+:'([^']+)'/)
      let iconBase64 = ''
      if (iconMatch) {
        const zip = new AdmZip(localApkPath)
        const iconPath = iconMatch[1]
        const iconBuffer = zip.getEntry(iconPath).getData()
        iconBase64 = iconBuffer.toString('base64')
        conf.set(`${deviceId}_${packageName}_icon`, { icon: iconBase64, name: appName })
      }

      return {
        icon: iconBase64,
        name: appName
      }
    } catch (error) {
      console.error('获取APK图标失败:', error)
      throw error
    }
  })
)

// ... 其他现有的代码 ...

// 远程连接设备
ipcMain.handle(
  'connectToRemoteDevice',
  handleResponse(async (_, ip: string, port?: number) => {
    try {
      if (port) {
        const result = await client.connect(ip, port)
        return { success: true, data: result }
      } else {
        const result = await client.connect(ip)
        return { success: true, data: result }
      }
    } catch (error) {
      return { success: false, error: '连接失败' }
    }
  })
)

// 重启设备
ipcMain.handle(
  'rebootDevice',
  handleResponse(async (_, deviceId: string) => {
    await client.reboot(deviceId)
    return { success: true }
  })
)

// 关机设备
ipcMain.handle(
  'shutdownDevice',
  handleResponse(async (_, deviceId: string) => {
    await client.shutdown(deviceId)
    return { success: true }
  })
)

// 重启到recovery
ipcMain.handle(
  'rebootToRecovery',
  handleResponse(async (_, deviceId: string) => {
    await client.shell(deviceId, 'reboot recovery')
    return { success: true }
  })
)

// 执行shell命令
ipcMain.handle(
  'executeShellCommand',
  handleResponse(async (_, deviceId: string, command: string) => {
    const result = await client.shell(deviceId, command)
    console.log(result, 'result====>')
    return result
  })
)
