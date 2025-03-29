<template>
  <view class="lottery-frequency-chart">
    <view class="chart-container">
      <qiun-data-charts
        type="column"
        :opts="opts"
        :chartData="chartData"
        :canvas2d="true"
        canvasId="frequencyChart"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, watchEffect, unref } from 'vue'
import { useFrequencyDataQuery, ApiResponse } from '@/service/app/chart.vuequery'
// import type { ApiResponse } from '@/service/app/chart.vuequery'
import QiunDataCharts from '@/components/QiunDataCharts.vue'

defineOptions({
  name: 'LotteryFrequencyChart',
})

const props = defineProps<{
  lotteryType: string
  zoneType: string
  periodCount: number
}>()

// 模拟数据，用于开发测试
const mockData = {
  success: true,
  data: {
    numbers: Array.from({ length: 33 }, (_, i) => i + 1),
    frequencies: Array.from({ length: 33 }, () => Math.random().toFixed(2)),
  },
}

// 图表数据
const chartData = ref({
  categories: [],
  series: [
    {
      name: '出现频率',
      data: [],
      color: props.zoneType === 'red' ? '#ff5252' : '#4285f4',
    },
  ],
})

// 图表配置
const opts = computed(() => {
  // 获取窗口宽度来确定是移动端还是网页
  const windowWidth = uni.getSystemInfoSync().windowWidth
  const isMobile = windowWidth <= 480

  return {
    color: [props.zoneType === 'red' ? '#ff5252' : '#4285f4'],
    padding: [15, isMobile ? 10 : 5, 0, isMobile ? 10 : 5],
    enableScroll: true,
    legend: {
      show: false,
    },
    xAxis: {
      disableGrid: true,
      scrollShow: true,
      itemCount: isMobile ? 6 : 20,
      fontSize: isMobile ? 9 : 10,
    },
    yAxis: {
      gridType: 'dash',
      dashLength: 2,
      data: [
        {
          min: 0,
          max: 1,
          format: (val) => val.toFixed(2),
        },
      ],
      fontSize: isMobile ? 9 : 10,
    },
    extra: {
      column: {
        width: isMobile ? 12 : 15,
        activeBgColor: '#000000',
        activeBgOpacity: 0.08,
      },
    },
    width: isMobile ? windowWidth - 20 : windowWidth,
    height: isMobile ? 250 : 300,
  }
})

// 获取频率数据
const query = useFrequencyDataQuery(
  computed(() => props.lotteryType),
  computed(() => props.zoneType),
  computed(() => props.periodCount),
)

// 监听属性变化
watch([() => props.lotteryType, () => props.zoneType, () => props.periodCount], () => {
  console.log('Props changed, refetching data...')
  query.refetch()
})

// 更新图表数据
watchEffect(() => {
  try {
    console.log('Updating frequency chart with period count:', props.periodCount, 'query state:', {
      data: query.data.value,
      isLoading: query.isLoading.value,
      error: query.error.value,
    })

    // 使用真实数据或模拟数据
    const queryData = unref(query.data)
    console.log('Raw API response:', queryData)

    // 从 API 响应中提取数据
    const dataset = queryData?.data?.datasets?.[0]?.data || []
    const data =
      dataset.length > 0
        ? {
            numbers: dataset.map((item) => item.position),
            frequencies: dataset.map((item) => item.value),
          }
        : mockData.data

    console.log('Processed data:', data)
    console.log('Data validation:', {
      hasData: !!data,
      hasNumbers: data && Array.isArray(data.numbers),
      hasFrequencies: data && Array.isArray(data.frequencies),
    })

    // 更新图表数据
    chartData.value = {
      categories: data.numbers.map((num) => num.toString()),
      series: [
        {
          name: '出现频率',
          data: data.frequencies.map((freq) => parseFloat(freq.toString())),
          color: props.zoneType === 'red' ? '#ff5252' : '#4285f4',
        },
      ],
    }
  } catch (error) {
    console.error('Error updating frequency chart data:', error)
    // 出错时使用模拟数据
    chartData.value = {
      categories: mockData.data.numbers.map((num) => num.toString()),
      series: [
        {
          name: '出现频率',
          data: mockData.data.frequencies.map((freq) => parseFloat(freq.toString())),
          color: props.zoneType === 'red' ? '#ff5252' : '#4285f4',
        },
      ],
    }
  }
})
</script>

<style lang="scss" scoped>
.lottery-frequency-chart {
  width: 100%;

  .chart-container {
    width: 100%;
    height: 300px;
  }
}
</style>
