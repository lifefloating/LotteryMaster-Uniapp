<template>
  <view class="lottery-trend-chart">
    <view class="chart-container">
      <qiun-data-charts
        type="line"
        :opts="opts"
        :chartData="chartData"
        :canvas2d="true"
        canvasId="trendChart"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect, defineAsyncComponent, unref } from 'vue'
import { useTrendDataQuery } from '@/service/app/chart.vuequery'

const QiunDataCharts = defineAsyncComponent(() => import('@/components/QiunDataCharts.vue'))

defineOptions({
  name: 'LotteryTrendChart',
})

const props = defineProps<{
  lotteryType: string
  zoneType: string
  periodCount: number
}>()

// 图表数据
const chartData = ref({
  categories: [],
  series: [
    {
      name: '出现次数',
      data: [],
      color: props.zoneType === 'red' ? '#ff5252' : '#4285f4',
    },
  ],
})

// 图表配置
const opts = computed(() => {
  return {
    color: [props.zoneType === 'red' ? '#ff5252' : '#4285f4'],
    padding: [15, 15, 0, 5],
    enableScroll: true,
    legend: {
      show: false,
    },
    xAxis: {
      disableGrid: true,
      scrollShow: true,
      itemCount: 20,
      fontSize: 10,
    },
    yAxis: {
      gridType: 'dash',
      dashLength: 2,
      data: [
        {
          min: 0,
        },
      ],
    },
    extra: {
      line: {
        type: 'straight',
        width: 2,
        activeType: 'hollow',
      },
    },
  }
})

// 获取走势数据
const {
  data: trendData,
  isLoading,
  error,
} = useTrendDataQuery(
  computed(() => props.lotteryType),
  computed(() => props.zoneType),
  computed(() => props.periodCount),
  true,
)

// 模拟数据，用于开发测试
const mockData = {
  success: true,
  data: {
    numbers: Array.from({ length: 33 }, (_, i) => i + 1),
    frequencies: Array.from({ length: 33 }, () => Math.floor(Math.random() * 20) + 1),
  },
}

// 监听数据变化，更新图表
watchEffect(() => {
  try {
    console.log('Updating trend chart with period count:', props.periodCount, 'query state:', {
      data: trendData.value,
      isLoading: isLoading.value,
      error: error.value,
    })

    // 使用真实数据或模拟数据
    const queryData = unref(trendData)
    const data = queryData?.data || mockData.data

    // 确保数据存在且包含必要的属性
    if (data && Array.isArray(data.numbers) && Array.isArray(data.frequencies)) {
      // 更新图表数据
      chartData.value = {
        categories: data.numbers.map((num) => num.toString()),
        series: [
          {
            name: '出现次数',
            data: data.frequencies,
            color: props.zoneType === 'red' ? '#ff5252' : '#4285f4',
          },
        ],
      }
    } else {
      console.warn('Invalid data format received in LotteryTrendChart, using mock data instead')
      // 使用模拟数据
      chartData.value = {
        categories: mockData.data.numbers.map((num) => num.toString()),
        series: [
          {
            name: '出现次数',
            data: mockData.data.frequencies,
            color: props.zoneType === 'red' ? '#ff5252' : '#4285f4',
          },
        ],
      }
    }
  } catch (error) {
    console.error('Error updating trend chart data:', error)
    // 出错时也使用模拟数据
    chartData.value = {
      categories: mockData.data.numbers.map((num) => num.toString()),
      series: [
        {
          name: '出现次数',
          data: mockData.data.frequencies,
          color: props.zoneType === 'red' ? '#ff5252' : '#4285f4',
        },
      ],
    }
  }
})
</script>

<style lang="scss" scoped>
.lottery-trend-chart {
  width: 100%;

  .chart-container {
    width: 100%;
    height: 300px;
  }
}
</style>
