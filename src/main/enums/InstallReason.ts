export enum InstallReason {
  USER_INSTALL = 0,
  SYSTEM_UPDATE = 1,
  DEVICE_OWNER = 2,
  DEVICE_INITIALIZATION = 3,
  ADMIN_ENFORCEMENT = 4,
  UNKNOWN = -1
}

export function getInstallReasonDescription(reasonCode: number): string {
  switch (reasonCode) {
    case InstallReason.USER_INSTALL:
      return '用户安装'
    case InstallReason.SYSTEM_UPDATE:
      return '系统更新'
    case InstallReason.DEVICE_OWNER:
      return '设备所有者'
    case InstallReason.DEVICE_INITIALIZATION:
      return '设备初始化'
    case InstallReason.ADMIN_ENFORCEMENT:
      return '管理员强制执行'
    default:
      return `未知 (${reasonCode})`
  }
}
