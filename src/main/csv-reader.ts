import fs from 'fs'
import { parse } from 'csv-parse/sync'

import csvFilePath from '../../resources/brand_model.csv?asset&asarUnpack'

interface DeviceModel {
  model: string
  model_name: string
}

let deviceModels: DeviceModel[] = []

// 读取 CSV 文件
function loadDeviceModels() {
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8')
  deviceModels = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  })
  console.log(`已加载 ${deviceModels.length} 个设备型号`)
}

// 初始化时加载 CSV 数据
loadDeviceModels()

// 查询设备营销名称
export function getMarketingName(modelNumber: string): string {
  const device = deviceModels.find((d) => d.model === modelNumber)
  console.log(device)
  return device ? device.model_name : modelNumber
}
