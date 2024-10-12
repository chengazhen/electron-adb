import { ElMessage } from 'element-plus'

interface ResponseData<T> {
  success: boolean
  data: T | null
  error: string | null
}

export async function handleResponse<T>(
  promise: Promise<ResponseData<T>>,
  successMessage?: string,
  errorMessage?: string
): Promise<T | null> {
  try {
    const response = await promise
    if (response.success) {
      if (successMessage) {
        ElMessage.success(successMessage)
      }
      return response.data
    } else {
      ElMessage.error(errorMessage || response.error || '操作失败')
      return null
    }
  } catch (error) {
    console.error('Error in handleResponse:', error)
    ElMessage.error(errorMessage || '操作失败')
    return null
  }
}
