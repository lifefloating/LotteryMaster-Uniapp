import { CustomRequestOptions } from '@/interceptors/request'

/**
 * 请求方法: 主要是对 uni.request 的封装，去适配 openapi-ts-request 的 request 方法
 * 增加了CORS跨域错误处理
 * @param options 请求参数
 * @returns 返回 Promise 对象
 */
const http = <T>(options: CustomRequestOptions) => {
  // 判断是否为开发环境
  // 使用import.meta.env或通过条件编译判断环境
  const isDev = import.meta.env?.MODE === 'development' || import.meta.env?.DEV === true
  // #ifdef H5
  // 在H5环境中，可以通过window.__UNI_DEVELOPMENT__判断
  const isH5Dev = typeof window !== 'undefined' && (window as any).__UNI_DEVELOPMENT__
  // #endif

  // 在开发环境下打印请求信息，帮助调试
  if (isDev
    // #ifdef H5
    || isH5Dev
    // #endif
  ) {
    console.log(`[Request] ${options.method || 'GET'} ${options.url}`)
  }

  // 返回 Promise 对象
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 提取核心数据 res.data
          resolve(res.data as T)
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          // userStore.clearUserInfo()
          // uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: (res.data as T & { msg?: string })?.msg || '请求错误',
            })
          reject(res)
        }
      },
      // 响应失败 - 增加跨域错误检测和处理
      fail(err) {
        // 检查是否为CORS跨域错误
        const errorMsg = err.errMsg || String(err)
        const isCorsError =
          errorMsg.includes('cross-origin') ||
          errorMsg.includes('CORS') ||
          errorMsg.includes('Access-Control-Allow-Origin')

        if (import.meta.env?.MODE === 'development' || import.meta.env?.DEV === true
          // #ifdef H5
          || (typeof window !== 'undefined' && (window as any).__UNI_DEVELOPMENT__)
          // #endif
        ) {
          console.error('[Request Error]', err)

          if (isCorsError) {
            console.warn(
              '[CORS Error] 检测到跨域请求错误，可能是由于:\n' +
                '1. 后端服务未启动或不可用\n' +
                '2. 请求的域名与API服务器不同源\n' +
                '建议检查服务器状态或在服务端添加正确的CORS配置',
            )
          }
        }

        // 显示适当的错误提示
        uni.showToast({
          icon: 'none',
          title: isCorsError ? '跨域访问受限，请检查网络或服务器状态' : '网络错误，换个网络试试',
        })

        reject(err)
      },
    })
  })
}

/*
 * openapi-ts-request 工具的 request 跨客户端适配方法
 */
export default function request<T = unknown>(
  url: string,
  options: Omit<CustomRequestOptions, 'url'> & {
    params?: Record<string, unknown>
    headers?: Record<string, unknown>
  },
) {
  const requestOptions = {
    url,
    ...options,
  }

  if (options.params) {
    requestOptions.query = requestOptions.params
    delete requestOptions.params
  }

  if (options.headers) {
    requestOptions.header = options.headers
    delete requestOptions.headers
  }

  return http<T>(requestOptions)
}
