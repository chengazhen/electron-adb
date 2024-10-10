import { defineStore } from 'pinia'

interface DeviceState {
  connectedDevice: string | null
  deviceList: { id: string; type: string }[]
}

export const useDeviceStore = defineStore('device', {
  state: (): DeviceState => ({
    connectedDevice: null,
    deviceList: [],
  }),
  actions: {
    setConnectedUsbDevice(deviceId: string) {
      this.connectedDevice = deviceId
    },
    async fetchDevices() {
      try {
        this.deviceList = await window.api.listDevices()
      } catch (error) {
        console.error('Failed to fetch devices:', error)
      }
    },
    async connectDevice(deviceId: string) {
      try {
        await window.api.connectDevice(deviceId)
        this.connectedDevice = deviceId
      } catch (error) {
        console.error('Failed to connect device:', error)
      }
    },
    async disconnectDevice() {
      try {
        await window.api.disconnectDevice()
        this.connectedDevice = null
      } catch (error) {
        console.error('Failed to disconnect device:', error)
      }
    }
  }
})