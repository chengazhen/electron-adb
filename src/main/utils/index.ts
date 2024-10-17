import { Client } from 'adb-ts';

class Utils {
  private client: Client;

  constructor() {
    this.client = new Client();
  }

  /**
   * 启用未知来源权限 (Android 7.1 及以下)
   */
  async enableUnknownSources(serial: string): Promise<void> {
    try {
      console.log('正在启用未知来源安装...');
      await this.client.shell(serial, 'settings put global install_non_market_apps 1');
      console.log('未知来源安装已启用。');
    } catch (error) {
      console.error('启用未知来源时出错：', error);
    }
  }

  /**
   * 跳转到未知来源应用设置页面 (Android 8.0 及以上)
   */
  async openUnknownSourcesSettings(serial: string): Promise<void> {
    try {
      console.log('打开未知来源设置页面...');
      await this.client.shell(serial, 'am start -a android.settings.MANAGE_UNKNOWN_APP_SOURCES');
      console.log('请手动为应用授权。');
    } catch (error) {
      console.error('打开设置页面时出错：', error);
    }
  }

 

  /**
   * 检查设备的 Android 版本
   * @param serial 设备序列号
   */
  async getAndroidVersion(serial: string): Promise<number> {
    try {
      const properties = await this.client.listProperties(serial);
      const sdkVersion = parseInt(properties['ro.build.version.sdk'], 10);
      console.log(`Android SDK 版本：${sdkVersion}`);
      return sdkVersion;
    } catch (error) {
      console.error('获取 Android 版本时出错：', error);
      throw error;
    }
  }

  /**
   * 智能安装 APK，根据 Android 版本决定是否自动启用未知来源
   * @param serial 设备序列号
   * @param apkPath APK 文件路径
   */
  async smartInstall(serial: string, apkPath: string): Promise<void> {
    try {
      const version = await this.getAndroidVersion(serial);
      if (version <= 25) {
        await this.enableUnknownSources(serial);
      } else {
        await this.openUnknownSourcesSettings(serial);
      }
      await this.client.install(serial, apkPath);
    } catch (error) {
      console.error('智能安装时出错：', error);
    }
  }
}

export default Utils;
