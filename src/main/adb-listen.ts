import * as adb from 'adbkit';
import { ipcMain } from 'electron';
// ADB 功能
const client = adb.createClient();

ipcMain.handle('list-devices', async () => {
  try {
    const devices = await client.listDevices();
    return devices;
  } catch (err) {
    console.error('Error listing devices:', err);
    throw err;
  }
});

ipcMain.handle('install-apk', async (event: Electron.IpcMainInvokeEvent, { deviceId, apkPath }: { deviceId: string, apkPath: string }) => {
  try {
    await client.install(deviceId, apkPath);
    return { success: true };
  } catch (err) {
    console.error('Error installing APK:', err);
    throw err;
  }
});