import { useQuery } from '@tanstack/vue-query'
import { getFrequencyData, getTrendData, type TrendChartData, type FrequencyChartData, type ApiResponse } from './chart'
import { computed, unref, type Ref, watch } from 'vue'
import type { UseQueryReturnType } from '@tanstack/vue-query'

export type { TrendChartData, FrequencyChartData, ApiResponse } from './chart'

/**
 * 使用走势图数据查询
 * @param type 彩票类型
 * @param zoneType 区域类型 (red/blue)
 * @param periodCount 期数
 * @param includeChartData 是否包含图表数据
 */
export function useTrendDataQuery(
  type: string | Ref<string>,
  zoneType: string | Ref<string>,
  periodCount: number | Ref<number>,
  includeChartData: boolean = false
) {
  const typeValue = computed(() => unref(type))
  const zoneTypeValue = computed(() => unref(zoneType))
  const periodCountValue = computed(() => unref(periodCount))

  const queryKey = computed(() => ['trendData', typeValue.value, zoneTypeValue.value, periodCountValue.value, includeChartData])

  const query = useQuery({
    queryKey: queryKey.value,
    queryFn: () => {
      console.log('Calling trend API with:', {
        type: typeValue.value,
        zoneType: zoneTypeValue.value,
        periodCount: periodCountValue.value,
        includeChartData
      })
      return getTrendData(typeValue.value, zoneTypeValue.value, periodCountValue.value, includeChartData)
    },
    staleTime: 0, // 设置为 0，这样每次参数变化都会重新获取数据
    refetchOnWindowFocus: false,
    enabled: true // 确保查询是启用的
  })

  // 监听参数变化，自动重新获取数据
  watch([typeValue, zoneTypeValue, periodCountValue], () => {
    console.log('Query params changed, refetching trend data...')
    query.refetch()
  }, { immediate: true })

  return query as UseQueryReturnType<ApiResponse<TrendChartData>, Error>
}

/**
 * 使用频率数据查询
 * @param type 彩票类型
 * @param zoneType 区域类型 (red/blue)
 * @param periodCount 期数
 */
export function useFrequencyDataQuery(
  type: string | Ref<string>,
  zoneType: string | Ref<string>,
  periodCount: number | Ref<number>
) {
  const typeValue = computed(() => unref(type))
  const zoneTypeValue = computed(() => unref(zoneType))
  const periodCountValue = computed(() => unref(periodCount))

  const queryKey = computed(() => ['frequencyData', typeValue.value, zoneTypeValue.value, periodCountValue.value])

  const query = useQuery({
    queryKey: queryKey.value,
    queryFn: () => {
      console.log('Calling frequency API with:', {
        type: typeValue.value,
        zoneType: zoneTypeValue.value,
        periodCount: periodCountValue.value
      })
      return getFrequencyData(typeValue.value, zoneTypeValue.value, periodCountValue.value)
    },
    staleTime: 0, // 设置为 0，这样每次参数变化都会重新获取数据
    refetchOnWindowFocus: false,
    enabled: true // 确保查询是启用的
  })

  // 监听参数变化，自动重新获取数据
  watch([typeValue, zoneTypeValue, periodCountValue], () => {
    console.log('Query params changed, refetching...')
    query.refetch()
  }, { immediate: true })

  return query as UseQueryReturnType<ApiResponse<FrequencyChartData>, Error>
} 