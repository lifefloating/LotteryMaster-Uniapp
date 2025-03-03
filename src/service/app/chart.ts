import request from '@/utils/request'

// Define response types
export interface ChartData {
  numbers: number[]
  frequencies: number[]
}

export interface ApiResponse {
  success: boolean
  data: ChartData
}

/**
 * 获取走势图数据
 * @param type 彩票类型
 * @param zoneType 区域类型 (red/blue)
 * @param periodCount 期数
 * @param includeChartData 是否包含图表数据
 */
export function getTrendData(
  type: string,
  zoneType: string,
  periodCount: number,
  includeChartData: boolean = false
): Promise<ApiResponse> {
  return request('/api/chart/trend', {
    method: 'GET',
    params: {
      type,
      zoneType,
      periodCount,
      includeChartData
    }
  })
}

/**
 * 获取频率数据
 * @param type 彩票类型
 * @param zoneType 区域类型 (red/blue)
 * @param periodCount 期数
 */
export function getFrequencyData(
  type: string,
  zoneType: string,
  periodCount: number
): Promise<ApiResponse> {
  return request('/api/chart/frequency', {
    method: 'GET',
    params: {
      type,
      zoneType,
      periodCount
    }
  })
} 