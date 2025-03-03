<template>
  <view class="qiun-charts">
    <canvas
      class="charts"
      :id="canvasId"
      :canvas-id="canvasId"
      :style="{ width: cWidth + 'px', height: cHeight + 'px' }"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    ></canvas>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue'
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
let uChartsInstance: any = null

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    cWidth.value = uni.upx2px(750)
    cHeight.value = 250

    // #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-BAIDU || MP-QQ || MP-TOUTIAO
    uni
      .createSelectorQuery()
      .select(`#${props.canvasId}`)
      .boundingClientRect((res: any) => {
        if (res) {
          cWidth.value = res.width || cWidth.value
          cHeight.value = res.height || cHeight.value
          drawCharts()
        }
      })
      .exec()
    // #endif

    // #ifdef MP-WEIXIN
    const query = uni.createSelectorQuery()
    query
      .select(`#${props.canvasId}`)
      .boundingClientRect((res: any) => {
        if (res) {
          cWidth.value = res.width || cWidth.value
          cHeight.value = res.height || cHeight.value
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

  // eslint-disable-next-line new-cap
  uChartsInstance = new uCharts({
    type: props.type,
    context: ctx,
    width: cWidth.value,
    height: cHeight.value,
    categories: props.chartData.categories,
    series: props.chartData.series,
    animation: true,
    background: '#FFFFFF',
    pixelRatio: 1,
    ...props.opts,
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
