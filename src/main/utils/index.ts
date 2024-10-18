import { Client } from 'adb-ts'
import { PropertyMap, PropertyValue } from 'adb-ts/lib/util/types'
class Utils {
  private client: Client
  private properties?: PropertyMap

  constructor(client: Client) {
    this.client = client
  }

  /**
   * 启用未知来源权限 (Android 7.1 及以下)
   */
  async enableUnknownSources(serial: string): Promise<void> {
    try {
      console.log('正在启用未知来源安装...')
      await this.client.shell(serial, 'settings put global install_non_market_apps 1')
      console.log('未知来源安装已启用。')
    } catch (error) {
      console.error('启用未知来源时出错：', error)
    }
  }

  /**
   * 跳转到未知来源应用设置页面 (Android 8.0 及以上)
   */
  async openUnknownSourcesSettings(serial: string): Promise<void> {
    try {
      console.log('打开未知来源设置页面...')
      await this.client.shell(serial, 'am start -a android.settings.MANAGE_UNKNOWN_APP_SOURCES')
      console.log('请手动为应用授权。')
    } catch (error) {
      console.error('打开设置页面时出错：', error)
    }
  }

  /**
   * 检查设备的 Android 版本
   * @param serial 设备序列号
   */
  async getAndroidVersion(serial: string): Promise<number> {
    try {
      const properties = await this.client.listProperties(serial)
      const sdkVersion = parseInt(properties['ro.build.version.sdk'], 10)
      console.log(`Android SDK 版本：${sdkVersion}`)
      return sdkVersion
    } catch (error) {
      console.error('获取 Android 版本时出错：', error)
      throw error
    }
  }

  /**
   * 智能安装 APK，根据 Android 版本决定是否自动启用未知来源
   * @param serial 设备序列号
   * @param apkPath APK 文件路径
   */
  async smartInstall(serial: string, apkPath: string): Promise<void> {
    try {
      const version = await this.getAndroidVersion(serial)
      if (version <= 25) {
        await this.enableUnknownSources(serial)
      } else {
        await this.openUnknownSourcesSettings(serial)
      }
      await this.client.install(serial, apkPath)
    } catch (error) {
      console.error('智能安装时出错：', error)
    }
  }

  async getProperties(serial: string): Promise<PropertyMap> {
    if (!this.properties) {
      this.properties = await this.client.listProperties(serial)
    }
    return this.properties
  }

  async deviceName(serial: string): Promise<PropertyValue> {
    const properties = await this.getProperties(serial)
    return properties.get('persist.sys.device_name')
  }

  async ssidName(serial: string): Promise<string> {
    const wifiInfo = await this.client.shell(serial, 'dumpsys wifi | grep "SSID"')
    const connectedWifi = wifiInfo.match(/^=\*\s*ID:.*$/gm)
    const ssidMatch = connectedWifi && connectedWifi[0].match(/SSID:?\s*"([^"]+)"/)
    const currentWifi = ssidMatch ? ssidMatch[1] : '未连接'
    return currentWifi
  }

  async storageInfo(serial: string): Promise<{ total: string; used: string; available: string }> {
    const storageInfo = await this.client.shell(serial, 'df -h /data')
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
    return { total: totalStorage, used: usedStorage, available: availableStorage }
  }

  async modelName(serial: string): Promise<string> {
    const properties = await this.getProperties(serial)
    return properties.get('ro.product.model') as string
  }

  async memoryInfo(serial: string): Promise<{ total: string; available: string; used: string }> {
    const memoryInfo = await this.client.shell(serial, 'cat /proc/meminfo')
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

    return { total: totalMemoryGB, available: availableMemoryGB, used: usedMemoryGB }
  }
}

export default Utils
