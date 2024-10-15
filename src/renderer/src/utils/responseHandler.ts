import { ElMessage } from 'element-plus'

export async function handleResponse<T>(
  promise: Promise<ResponseData<T>>,
  successMessage?: string,
  errorMessage?: string,
  showError = true
): Promise<T | null> {
  try {
    const response = await promise
    if (response.success) {
      if (successMessage) {
        ElMessage.success(successMessage)
      }
      return response.data
    } else {
      if (showError) {
        ElMessage.error(errorMessage || response.error || '操作失败')
      }
      return null
    }
  } catch (error) {
    console.error('Error in handleResponse:', error)
    ElMessage.error(errorMessage || '操作失败')
    return null
  }
}
