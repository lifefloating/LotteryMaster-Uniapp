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
          :class="{ active: timeRange === '30' }"
          @click="handleTimeRangeChange('30')"
        >
          <text class="option-text">近30期</text>
        </view>
        <view
          class="time-option"
          :class="{ active: timeRange === '50' }"
          @click="handleTimeRangeChange('50')"
        >
          <text class="option-text">近50期</text>
        </view>
        <view
          class="time-option"
          :class="{ active: timeRange === '100' }"
          @click="handleTimeRangeChange('100')"
        >
          <text class="option-text">近100期</text>
        </view>
      </view>
    </view>

    <!-- 走势图表区域 -->
    <view class="trends-chart-container">
      <view class="chart-title">
        <text class="title-text">号码出现频率</text>
      </view>
      <view class="chart-content">
        <!-- 这里应该放置实际的图表组件 -->
        <view class="chart-placeholder">
          <text class="placeholder-text">号码频率图表</text>
        </view>
      </view>
    </view>

    <!-- 冷热号分析 -->
    <view class="hot-cold-analysis-container">
      <view class="analysis-title">
        <text class="title-text">冷热号分析</text>
      </view>
      <view class="analysis-content">
        <view class="hot-numbers">
          <view class="section-title">
            <text class="section-title-text">热号推荐</text>
          </view>
          <view class="number-balls-container">
            <lottery-number-ball
              v-for="num in hotNumbers"
              :key="'hot-' + num"
              :number="num"
              type="primary"
              :lottery-type="lotteryStore.currentLotteryType"
            />
          </view>
        </view>

        <view class="cold-numbers">
          <view class="section-title">
            <text class="section-title-text">冷号提醒</text>
          </view>
          <view class="number-balls-container">
            <lottery-number-ball
              v-for="num in coldNumbers"
              :key="'cold-' + num"
              :number="num"
              type="special"
              :lottery-type="lotteryStore.currentLotteryType"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import { useLotteryStore, type LotteryType } from '@/store/lottery'

const LotteryHeader = defineAsyncComponent(() => import('@/components/LotteryHeader.vue'))
const LotteryTypeSwitch = defineAsyncComponent(() => import('@/components/LotteryTypeSwitch.vue'))
const LotteryNumberBall = defineAsyncComponent(() => import('@/components/LotteryNumberBall.vue'))

defineOptions({
  name: 'TrendsPage',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 获取彩票数据
const lotteryStore = useLotteryStore()

// 时间范围
const timeRange = ref('30')

// 模拟数据 - 热号和冷号
const hotNumbers = ref([5, 12, 18, 25, 30])
const coldNumbers = ref([2, 9, 14, 21, 33])

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
  // 更新走势数据
}

// 处理时间范围切换
const handleTimeRangeChange = (range: string) => {
  timeRange.value = range
  // 更新走势数据
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

  .trends-chart-container,
  .hot-cold-analysis-container {
    padding: 16px;
    margin: 0 16px 16px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .chart-title,
    .analysis-title {
      margin-bottom: 16px;

      .title-text {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }

    .chart-content {
      .chart-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px;
        background-color: #f8fafc;
        border-radius: 8px;

        .placeholder-text {
          font-size: 14px;
          color: #94a3b8;
        }
      }
    }
  }

  .hot-cold-analysis-container {
    .analysis-content {
      .hot-numbers,
      .cold-numbers {
        margin-bottom: 20px;

        .section-title {
          margin-bottom: 12px;

          .section-title-text {
            font-size: 14px;
            color: #666666;
          }
        }

        .number-balls-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
    }
  }
}
</style>
