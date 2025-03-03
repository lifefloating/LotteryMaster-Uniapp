<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '走势分析',
  },
}
</route>

<template>
  <view
    class="trends-page"
    :style="{
      paddingTop: safeAreaInsets?.top + 'px',
      paddingBottom: safeAreaInsets?.bottom + 'px',
    }"
  >
    <!-- 顶部导航栏 -->
    <lottery-header title="走势分析" @back="handleBack" @history="handleHistory" />

    <!-- 彩票类型切换 -->
    <lottery-type-switch
      :active-type="lotteryStore.currentLotteryType"
      @switch="handleLotteryTypeSwitch"
    />

    <!-- 时间范围选择 -->
    <view class="time-range-container">
      <view class="time-range-title">
        <text class="title-text">时间范围</text>
      </view>
      <view class="time-range-options">
        <view
          class="time-option"
          :class="{ active: timeRange === '100' }"
          @click="handleTimeRangeChange('100')"
        >
          <text class="option-text">近100期</text>
        </view>
        <view
          class="time-option"
          :class="{ active: timeRange === '300' }"
          @click="handleTimeRangeChange('300')"
        >
          <text class="option-text">近300期</text>
        </view>
        <view
          class="time-option"
          :class="{ active: timeRange === '500' }"
          @click="handleTimeRangeChange('500')"
        >
          <text class="option-text">近500期</text>
        </view>
        <view
          class="time-option"
          :class="{ active: timeRange === 'all' }"
          @click="handleTimeRangeChange('all')"
        >
          <text class="option-text">全部期数</text>
        </view>
      </view>
    </view>

    <!-- 区域类型选择 -->
    <view class="zone-type-container">
      <view class="zone-type-title">
        <text class="title-text">区域选择</text>
      </view>
      <view class="zone-type-options">
        <view
          class="zone-option"
          :class="{ active: zoneType === 'red' }"
          @click="handleZoneTypeChange('red')"
        >
          <text class="option-text">红球</text>
        </view>
        <view
          class="zone-option"
          :class="{ active: zoneType === 'blue' }"
          @click="handleZoneTypeChange('blue')"
        >
          <text class="option-text">蓝球</text>
        </view>
      </view>
    </view>

    <!-- 走势图表区域 -->
    <view class="trends-chart-container">
      <view class="chart-title">
        <text class="title-text">号码走势图</text>
      </view>
      <view class="chart-content">
        <lottery-trend-chart
          :lottery-type="lotteryStore.currentLotteryType"
          :zone-type="zoneType"
          :period-count="getPeriodCount"
        />
      </view>
    </view>

    <!-- 频率图表区域 -->
    <view class="frequency-chart-container">
      <view class="chart-title">
        <text class="title-text">号码出现频率</text>
      </view>
      <view class="chart-content">
        <lottery-frequency-chart
          :lottery-type="lotteryStore.currentLotteryType"
          :zone-type="zoneType"
          :period-count="getPeriodCount"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, computed } from 'vue'
import { useLotteryStore, type LotteryType } from '@/store/lottery'

const LotteryHeader = defineAsyncComponent(() => import('@/components/LotteryHeader.vue'))
const LotteryTypeSwitch = defineAsyncComponent(() => import('@/components/LotteryTypeSwitch.vue'))
const LotteryTrendChart = defineAsyncComponent(() => import('@/components/LotteryTrendChart.vue'))
const LotteryFrequencyChart = defineAsyncComponent(
  () => import('@/components/LotteryFrequencyChart.vue'),
)

defineOptions({
  name: 'TrendsPage',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 获取彩票数据
const lotteryStore = useLotteryStore()

// 时间范围
const timeRange = ref('100')

// 区域类型
const zoneType = ref('red')

// 处理返回按钮点击
const handleBack = () => {
  uni.navigateBack()
}

// 处理历史记录按钮点击
const handleHistory = () => {
  uni.navigateTo({
    url: '/pages-sub/history/index',
  })
}

// 处理彩票类型切换
const handleLotteryTypeSwitch = (type: LotteryType) => {
  lotteryStore.setLotteryType(type)
}

// 处理时间范围切换
const handleTimeRangeChange = (range: string) => {
  console.log('Time range changed to:', range)
  timeRange.value = range
  console.log('New period count:', getPeriodCount.value)
}

// 获取实际期数值
const getPeriodCount = computed(() => {
  // 根据选择的时间范围返回对应的期数值
  const count = (() => {
    switch (timeRange.value) {
      case '100':
        return 100
      case '300':
        return 300
      case '500':
        return 500
      case 'all':
        return 5000
      default:
        return 100
    }
  })()
  console.log('Computing period count:', { timeRange: timeRange.value, count })
  return count
})

// 处理区域类型切换
const handleZoneTypeChange = (type: string) => {
  zoneType.value = type
}
</script>

<style lang="scss" scoped>
.trends-page {
  min-height: 100vh;
  background-color: #f5f7fa;

  .time-range-container {
    padding: 16px;

    .time-range-title {
      margin-bottom: 12px;

      .title-text {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }

    .time-range-options {
      display: flex;

      .time-option {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        height: 40px;
        margin: 0 4px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }

        .option-text {
          font-size: 14px;
          color: #666666;
        }

        &.active {
          background-color: #3b82f6;

          .option-text {
            font-weight: 500;
            color: #ffffff;
          }
        }
      }
    }
  }

  .zone-type-container {
    padding: 16px;

    .zone-type-title {
      margin-bottom: 12px;

      .title-text {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }

    .zone-type-options {
      display: flex;

      .zone-option {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        height: 40px;
        margin: 0 4px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }

        .option-text {
          font-size: 14px;
          color: #666666;
        }

        &.active {
          background-color: #3b82f6;

          .option-text {
            font-weight: 500;
            color: #ffffff;
          }
        }
      }
    }
  }

  .trends-chart-container,
  .frequency-chart-container {
    padding: 16px;
    margin: 0 16px 16px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .chart-title {
      margin-bottom: 16px;

      .title-text {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }

    .chart-content {
      width: 100%;
      height: 300px;
    }
  }
}
</style>
