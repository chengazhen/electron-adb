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

const conf = new Conf()

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
      const properties = await client.listProperties(deviceId)
      const batteryStatus = await client.batteryStatus(deviceId)
      console.log(properties.get('ro.product.manufacturer'))
      // 获取储存信息
      const storageInfo = await client.shell(deviceId, 'df -h /data')
      const storageLines = storageInfo.split('\n')
      let totalStorage = ''
      let usedStorage = ''
      let availableStorage = ''

      if (storageLines.length > 1) {
        const storageData = storageLines[1].split(/\s+/)
        if (storageData.length >= 4) {
          totalStorage = storageData[1]
          usedStorage = storageData[2]
          availableStorage = storageData[3]
        }
      }

      const model = properties.get('ro.product.model') as string
      const marketingName = getMarketingName(model)

      // 获取运行内存使用情况
      const memoryInfo = await client.shell(deviceId, 'cat /proc/meminfo')
      const memLines = memoryInfo.split('\n')
      let totalMemory = ''
      let availableMemory = ''

      for (const line of memLines) {
        if (line.startsWith('MemTotal:')) {
          totalMemory = line.split(/\s+/)[1]
        } else if (line.startsWith('MemAvailable:')) {
          availableMemory = line.split(/\s+/)[1]
        }
        if (totalMemory && availableMemory) break
      }

      const totalMemoryGB = (parseInt(totalMemory) / 1024 / 1024).toFixed(2)
      const availableMemoryGB = (parseInt(availableMemory) / 1024 / 1024).toFixed(2)
      const usedMemoryGB = (parseFloat(totalMemoryGB) - parseFloat(availableMemoryGB)).toFixed(2)

      // 获取WiFi状态
      const wifiStatus = await client.shell(deviceId, 'dumpsys wifi | grep "Wi-Fi is"')
      const isWifiEnabled = wifiStatus.includes('Wi-Fi is enabled')

      // 获取当前连接的WiFi名称
      const wifiInfo = await client.shell(deviceId, 'dumpsys wifi | grep "mWifiInfo"')
      const ssidMatch = wifiInfo.match(/SSID:\s*"([^"]+)"/)
      const currentWifi = ssidMatch ? ssidMatch[1] : '未连接'

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
        currentWifi
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
