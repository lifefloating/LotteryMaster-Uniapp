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
      width: '100%',
    }"
  >
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
        <text class="title-text">号码数据分析</text>
      </view>
      <view class="chart-content">
        <lottery-heatmap-board
          :lottery-type="lotteryStore.currentLotteryType"
          :zone-type="zoneType"
          :period-count="getPeriodCount"
        />
      </view>
    </view>

    <!-- 数据卡片区域 -->
    <view class="data-cards-container">
      <view class="chart-title">
        <text class="title-text">统计数据</text>
      </view>
      <view class="chart-content">
        <lottery-data-cards
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
const LotteryHeatmapBoard = defineAsyncComponent(
  () => import('@/components/LotteryHeatmapBoard.vue'),
)
const LotteryDataCards = defineAsyncComponent(() => import('@/components/LotteryDataCards.vue'))

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

// 页面行为
// 返回上一页
const handleBack = () => {
  uni.navigateBack()
}

// 彩种类型切换处理
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
  background-color: #f5f5f7;
  overflow-x: hidden; // 防止页面内容溢出视口

  /* 时间范围容器样式 */
  .time-range-container {
    padding: 16px;
    margin-bottom: 8px;
    background-color: #ffffff;

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
      flex-wrap: wrap;
      gap: 8px;

      .time-option {
        padding: 6px 12px;
        border-radius: 20px;
        background-color: #f0f0f0;

        &.active {
          background-color: #333333;

          .option-text {
            color: #ffffff;
          }
        }

        .option-text {
          font-size: 14px;
          color: #666666;
        }
      }
    }
  }

  /* 区域类型容器样式 */
  .zone-type-container {
    padding: 16px;
    margin-bottom: 8px;
    background-color: #ffffff;

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
      gap: 12px;

      .zone-option {
        flex: 1;
        padding: 8px 0;
        border-radius: 20px;
        background-color: #f0f0f0;
        text-align: center;

        &.active {
          &:first-child {
            background-color: #ff5252; // 红球激活颜色
          }

          &:last-child {
            background-color: #4285f4; // 蓝球激活颜色
          }

          .option-text {
            color: #ffffff;
          }
        }

        .option-text {
          font-size: 14px;
          color: #666666;
        }
      }
    }
  }

  .trends-chart-container,
  .data-cards-container {
    padding: 0;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    width: 100%;
    margin: 0 0 16px 0;

    .chart-title {
      margin-bottom: 8px;
      padding: 16px 16px 0 16px;

      .title-text {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }

    .chart-content {
      width: 100%;
    }
  }
}
</style>
