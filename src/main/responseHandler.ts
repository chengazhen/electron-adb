/* eslint-disable @typescript-eslint/no-explicit-any */

export function handleResponse(handler: (...args: any[]) => Promise<any>) {
  return async (...args: any[]) => {
    try {
      const result = await handler(...args)
      return {
        success: true,
        data: result,
        error: null
      }
    } catch (error) {
      console.error('Error in handler:', error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}
