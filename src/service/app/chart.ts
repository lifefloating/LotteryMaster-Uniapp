import request from '@/utils/request'

// 趋势图数据类型
export interface TrendChartData {
  statistics: {
    numberStats: Array<{
      number: number
      frequency: number
      averageInterval: number
      maxInterval: number
      lastInterval: number
      currentInterval: number
      probability: number
    }>
  }
}

// 频率图数据类型
export interface FrequencyChartData {
  datasets: Array<{
    label: string
    data: Array<{
      position: number
      value: number
    }>
    backgroundColor: string
  }>
  type: string
  options: {
    responsive: boolean
    scales: {
      x: { title: { display: boolean, text: string } }
      y: { title: { display: boolean, text: string }, beginAtZero: boolean }
    }
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
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
): Promise<ApiResponse<TrendChartData>> {
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
): Promise<ApiResponse<FrequencyChartData>> {
  return request('/api/chart/frequency', {
    method: 'GET',
    params: {
      type,
      zoneType,
      periodCount
    }
  })
} 