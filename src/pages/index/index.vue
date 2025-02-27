<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '彩票大师',
  },
}
</route>

<template>
  <view
    class="prediction-page"
    :class="{ 'dark-theme': isDarkMode }"
    :style="{
      paddingTop: safeAreaInsets?.top + 'px',
      paddingBottom: safeAreaInsets?.bottom + 64 + 'px',
    }"
  >
    <!-- 顶部导航栏 -->
    <lottery-header title="彩票预测" @back="handleBack" @history="handleHistory" />

    <!-- 彩票类型切换 -->
    <lottery-type-switch
      :active-type="lotteryStore.currentLotteryType"
      @switch="handleLotteryTypeSwitch"
    />

    <!-- 期号和日期信息 -->
    <view class="lottery-info-container">
      <view class="lottery-info-item">
        <text class="info-label">购买日期</text>
        <text class="info-value">{{ lotteryData.date }}</text>
      </view>
      <view class="lottery-info-item">
        <text class="info-label">期号</text>
        <text class="info-value">{{ lotteryData.period }}</text>
      </view>
    </view>

    <!-- 预测号码展示区 -->
    <view class="prediction-title-container">
      <view class="report-button" @click="showReport = true">
        <wd-icon name="data-analysis" size="14px" color="#FFFFFF" />
        <text class="report-button-text">查看分析报告</text>
      </view>
    </view>

    <!-- 多组预测号码列表 -->
    <view class="prediction-sets-container">
      <scroll-view class="prediction-sets-scroll" scroll-y>
        <view class="prediction-sets-list">
          <lottery-prediction-set
            v-for="(prediction, index) in lotteryData.predictions"
            :key="index"
            :set-number="index + 1"
            :primary-numbers="prediction.primaryNumbers"
            :special-numbers="prediction.specialNumbers"
            :lottery-type="lotteryStore.currentLotteryType"
          />
        </view>
      </scroll-view>
    </view>

    <!-- 底部导航栏 -->
    <bottom-nav-bar active-tab="home" @tab-change="handleTabChange" />

    <!-- 分析报告组件 -->
    <analysis-report v-if="showReport" :visible="showReport" @close="showReport = false" />
  </view>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useThemeStore } from '@/store/theme'
import { useLotteryStore, type LotteryType } from '@/store/lottery'

const LotteryHeader = defineAsyncComponent(() => import('@/components/LotteryHeader.vue'))
const LotteryTypeSwitch = defineAsyncComponent(() => import('@/components/LotteryTypeSwitch.vue'))
const LotteryNumberBall = defineAsyncComponent(() => import('@/components/LotteryNumberBall.vue'))
const LotteryPredictionSet = defineAsyncComponent(
  () => import('@/components/LotteryPredictionSet.vue'),
)
const BottomNavBar = defineAsyncComponent(() => import('@/components/BottomNavBar.vue'))
const AnalysisReport = defineAsyncComponent(() => import('@/components/AnalysisReport.vue'))

defineOptions({
  name: 'PredictionPage',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 获取主题状态
const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkMode)

// 获取彩票数据
const lotteryStore = useLotteryStore()
const lotteryData = computed(() => lotteryStore.getCurrentLotteryData)
const topPrediction = computed(() => lotteryData.value.predictions[0])

// 控制分析报告显示
const showReport = ref(false)

// 页面加载时获取数据
onLoad(() => {
  lotteryStore.fetchLotteryData()
})

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
  lotteryStore.fetchLotteryData()
}

// 处理底部导航切换
const handleTabChange = (tab: string) => {
  if (tab === 'trends') {
    uni.navigateTo({
      url: '/pages/trends/index',
    })
  } else if (tab === 'my') {
    uni.navigateTo({
      url: '/pages/my/index',
    })
  }
}
</script>

<style lang="scss" scoped>
.prediction-page {
  min-height: 100vh;
  background-color: #f5f7fa;

  &.dark-theme {
    background-color: #111827;
  }

  .lottery-info-container {
    display: flex;
    justify-content: space-between;
    padding: 16px;

    .lottery-info-item {
      display: flex;
      flex-direction: column;

      .info-label {
        margin-bottom: 4px;
        font-size: 14px;
        color: #666666;
      }

      .info-value {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }
  }

  .prediction-title-container {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    margin: 0 16px;

    .report-button {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      border-radius: 20px;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.98);
        box-shadow: 0 1px 2px rgba(59, 130, 246, 0.3);
      }

      .report-button-text {
        margin: 0 4px;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }

  .prediction-sets-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 0 16px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;

    .prediction-sets-scroll {
      flex: 1;
      height: calc(100vh - 300px);
      min-height: 400px;
      max-height: 700px;
      padding: 12px;

      .prediction-sets-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }
  }

  &.dark-theme {
    .lottery-info-container {
      .lottery-info-item {
        .info-label {
          color: #d1d5db;
        }

        .info-value {
          color: #f9fafb;
        }
      }
    }

    .prediction-sets-container {
      background-color: #1f2937;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
