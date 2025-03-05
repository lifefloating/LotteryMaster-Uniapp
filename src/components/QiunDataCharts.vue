<template>
  <view class="qiun-charts">
    <canvas
      class="charts"
      :id="canvasId"
      :canvas-id="canvasId"
      :style="{ width: '100%', height: cHeight + 'px' }"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    ></canvas>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import uCharts from '@qiun/ucharts'

defineOptions({
  name: 'QiunDataCharts',
})

const props = defineProps<{
  type: string
  canvasId: string
  chartData: any
  opts: any
  canvas2d?: boolean
}>()

const cWidth = ref(375)
const cHeight = ref(250)
const windowWidth = ref(375)
let uChartsInstance: any = null

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // Get the actual window width
    const systemInfo = uni.getSystemInfoSync()
    windowWidth.value = systemInfo.windowWidth
    
    // Use a different approach for different platforms
    // #ifdef H5
    uni
      .createSelectorQuery()
      .select(`#${props.canvasId}`)
      .boundingClientRect((res: any) => {
        if (res) {
          cWidth.value = res.width || windowWidth.value
          cHeight.value = res.height || 250
          drawCharts()
        }
      })
      .exec()
    // #endif
    
    // #ifdef MP || APP-PLUS
    uni
      .createSelectorQuery()
      .select(`#${props.canvasId}`)
      .boundingClientRect((res: any) => {
        if (res) {
          // For mobile apps and mini programs, use the container width
          cWidth.value = res.width
          cHeight.value = res.height || 250
          drawCharts()
        }
      })
      .exec()
    // #endif
  })
}

// 绘制图表
const drawCharts = () => {
  if (!props.chartData || !props.chartData.categories || !props.chartData.series) {
    return
  }

  const ctx = uni.createCanvasContext(props.canvasId)
  
  // For mobile app and H5, use different approaches
  let chartWidth = cWidth.value
  let chartPadding = [15, 10, 0, 10]  // Default padding
  
  // #ifdef H5
  // For H5, ensure the full width with minimal side padding
  chartWidth = windowWidth.value
  chartPadding = [15, 0, 0, 0]
  // #endif
  
  // Get the device pixel ratio for better rendering
  const pixelRatio = uni.getSystemInfoSync().pixelRatio || 1
  
  // Get chart height from props or default
  const chartHeight = props.opts?.height || cHeight.value

  // Create chart with appropriate settings
  // eslint-disable-next-line new-cap
  uChartsInstance = new uCharts({
    type: props.type,
    context: ctx,
    width: chartWidth,
    height: chartHeight,
    categories: props.chartData.categories,
    series: props.chartData.series,
    animation: true,
    background: '#FFFFFF',
    pixelRatio: pixelRatio,
    ...props.opts,
    padding: chartPadding,
    enableScroll: true,  // Enable scrolling for long charts
    xAxis: {
      ...(props.opts?.xAxis || {}),
      scrollShow: true,  // Show scroll bar
      itemCount: props.type === 'line' ? 7 : 6,  // Show fewer items on mobile
    },
  })

  uChartsInstance.addEventListener('renderComplete', () => {
    console.log('renderComplete')
  })

  uChartsInstance.addEventListener('scrollLeft', () => {
    console.log('scrollLeft')
  })

  uChartsInstance.addEventListener('scrollRight', () => {
    console.log('scrollRight')
  })
}

// 图表触摸开始事件
const touchStart = (e: any) => {
  if (uChartsInstance) {
    uChartsInstance.touchStart(e)
  }
}

// 图表触摸移动事件
const touchMove = (e: any) => {
  if (uChartsInstance) {
    uChartsInstance.touchMove(e)
  }
}

// 图表触摸结束事件
const touchEnd = (e: any) => {
  if (uChartsInstance) {
    uChartsInstance.touchEnd(e)
  }
}

// 监听数据变化，重新绘制图表
watch(
  () => props.chartData,
  () => {
    if (uChartsInstance) {
      drawCharts()
    }
  },
  { deep: true },
)

// 组件挂载完成，初始化图表
onMounted(() => {
  initCharts()
})
</script>

<style lang="scss" scoped>
.qiun-charts {
  width: 100%;
  height: 100%;

  .charts {
    width: 100%;
    height: 100%;
  }
}
</style>
