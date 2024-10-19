interface ResponseData<T> {
  success: boolean
  data: T | null
  error: string | null
}

interface DeviceInfo {
  batteryInfo: {
    level: number
    acPowered: boolean
    usbPowered: boolean
    wirelessPowered: boolean
    maxChargingCurrent: number
    maxChargingVoltage: number
    chargeCounter: number
    status: number
    health: number
    present: boolean
    scale: number
    voltage: number
    temperature: number
    technology: string
  }
  serialNumber: string
  screenResolution: string
  screenSize: string
  model: string
  androidVersion: string
  manufacturer: string
  totalStorage: string
  usedStorage: string
  availableStorage: string
  totalMemoryGB: string
  availableMemoryGB: string
  usedMemoryGB: string
  marketingName: string
  isWifiEnabled: boolean
  currentWifi: string
  wifiIpAddress: string
}
