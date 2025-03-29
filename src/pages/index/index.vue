<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '彩票大师',
    enablePullDownRefresh: false,
    backgroundTextStyle: 'dark',
  },
}
</route>

<template>
  <view
    class="prediction-page"
    :style="{
      paddingTop: safeAreaInsets?.top + 'px',
      paddingBottom: safeAreaInsets?.bottom + 'px',
    }"
  >
    <!-- Loading 遮罩层 -->
    <view class="loading-overlay" v-if="isRefreshing">
      <wd-loading color="#3B82F6" size="36px" />
      <text class="loading-title">数据分析中</text>
      <text class="loading-subtitle">请耐心等待...</text>
    </view>

    <!-- 成功提示 -->
    <view class="toast-container success" v-if="showSuccessToast">
      <view class="toast-content">
        <wd-icon name="check-circle" size="24px" color="#059669" />
        <text class="toast-text">获取最新数据成功</text>
      </view>
    </view>

    <!-- 失败提示 -->
    <view class="toast-container error" v-if="showErrorToast">
      <view class="toast-content">
        <wd-icon name="warning" size="24px" color="#D97706" />
        <text class="toast-text">未能获取最新数据，请重新刷新</text>
      </view>
    </view>

    <!-- 彩票类型切换 -->
    <lottery-type-switch
      :active-type="lotteryStore.currentLotteryType"
      @switch="handleLotteryTypeSwitch"
    />

    <!-- 预测号码展示区 -->
    <view class="prediction-title-container">
      <view class="action-buttons">
        <view class="refresh-button" @click="refreshData">
          <wd-icon name="refresh" size="14px" color="#FFFFFF" />
          <text class="button-text">刷新最新数据</text>
        </view>
        <view class="report-button" v-if="!isFc3dType" @click="showReport = true">
          <wd-icon name="data-analysis" size="14px" color="#FFFFFF" />
          <text class="button-text">查看分析报告</text>
        </view>
      </view>
    </view>

    <!-- 今日概率最高号码 -->
    <view class="top-recommendation-container">
      <view class="top-recommendation-header">
        <view class="top-recommendation-title">
          <wd-icon name="hot" size="16px" color="#EF4444" />
          <text>今日概率最高号码</text>
        </view>
        <view class="top-recommendation-subtitle">根据历史数据分析，这组号码中奖概率最高</view>
      </view>
      <view class="top-recommendation-numbers">
        <lottery-prediction-set
          :primary-numbers="lotteryData.topRecommendation.primaryNumbers"
          :special-numbers="lotteryData.topRecommendation.specialNumbers"
          :lottery-type="lotteryStore.currentLotteryType"
        />
      </view>
    </view>

    <!-- 多组预测号码列表 -->
    <scroll-view class="prediction-sets-container" scroll-y>
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

    <!-- 分析报告组件 -->
    <analysis-report
      v-if="showReport && !isFc3dType"
      :visible="showReport"
      @close="showReport = false"
    />
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useLotteryStore, type LotteryType } from '@/store/lottery'
import LotteryHeader from '@/components/LotteryHeader.vue'
import LotteryTypeSwitch from '@/components/LotteryTypeSwitch.vue'
import LotteryNumberBall from '@/components/LotteryNumberBall.vue'
import LotteryPredictionSet from '@/components/LotteryPredictionSet.vue'
import AnalysisReport from '@/components/AnalysisReport.vue'

defineOptions({
  name: 'PredictionPage',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 获取彩票数据
const lotteryStore = useLotteryStore()
const lotteryData = computed(() => lotteryStore.getCurrentLotteryData)

// 控制分析报告显示
const showReport = ref(false)
// 控制刷新状态
const isRefreshing = ref(false)
// 控制提示显示
const showSuccessToast = ref(false)
const showErrorToast = ref(false)

// 页面加载时获取数据
onLoad(() => {
  // 不自动刷新数据，但确保有初始数据以便组件能正确渲染
  if (!lotteryData.value || !lotteryData.value.predictions) {
    lotteryStore.useMockData()
  }
  isRefreshing.value = false
})

// 刷新数据
const refreshData = async () => {
  isRefreshing.value = true
  // 重置提示状态
  showSuccessToast.value = false
  showErrorToast.value = false

  try {
    await lotteryStore.fetchLotteryData()

    // 检查是否有错误信息
    if (lotteryStore.error) {
      // 自定义失败提示，使用黄色
      showErrorToast.value = true
      setTimeout(() => {
        showErrorToast.value = false
      }, 3000)
    } else {
      // 自定义成功提示，使用绿色
      showSuccessToast.value = true
      setTimeout(() => {
        showSuccessToast.value = false
      }, 2000)
    }
  } catch (error) {
    console.error('刷新数据失败:', error)
    // 自定义失败提示，使用黄色
    showErrorToast.value = true
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  } finally {
    isRefreshing.value = false
  }
}

// 检查是否是fc3d类型
const isFc3dType = computed(() => {
  return lotteryStore.currentLotteryType === ('fc3d' as unknown as LotteryType)
})

// 彩种类型切换处理
const handleLotteryTypeSwitch = (type: LotteryType) => {
  lotteryStore.setLotteryType(type)
  // 不要自动刷新数据，只有在用户点击刷新按钮时才刷新
}
</script>

<style lang="scss" scoped>
.prediction-page {
  min-height: 100vh;
  background-color: #f8fafc;
  position: relative;
  background-image: radial-gradient(circle at 20% 10%, rgba(59, 130, 246, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.05) 0%, transparent 20%);

  .toast-container {
    position: fixed;
    top: calc(var(--status-bar-height) + 60px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    border-radius: 12px;
    padding: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 80%;
    max-width: 400px;
    animation: slideDown 0.3s ease-out forwards;

    .toast-content {
      display: flex;
      align-items: center;
      padding: 16px;
      border-radius: 12px;

      .toast-text {
        margin-left: 12px;
        font-size: 15px;
        font-weight: 500;
      }
    }

    &.success {
      .toast-content {
        background-color: #d1fae5;
        border: 1px solid #a7f3d0;

        .toast-text {
          color: #065f46;
        }
      }
    }

    &.error {
      .toast-content {
        background-color: #fef3c7;
        border: 1px solid #fde68a;

        .toast-text {
          color: #92400e;
        }
      }
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);

    .loading-title {
      margin-top: 16px;
      font-size: 18px;
      color: #3b82f6;
      font-weight: 700;
    }

    .loading-subtitle {
      margin-top: 4px;
      font-size: 13px;
      color: #6b7280;
      font-weight: 400;
    }
  }

  .prediction-title-container {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    margin: 0 16px;

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 12px;

      .refresh-button,
      .report-button {
        display: flex;
        align-items: center;
        padding: 10px 18px;
        border-radius: 24px;
        box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
        transition: all 0.3s ease;

        &:active {
          box-shadow: 0 2px 3px rgba(59, 130, 246, 0.2);
          transform: scale(0.97);
        }

        .button-text {
          margin: 0 6px;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }
      }

      .refresh-button {
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      }

      .report-button {
        background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      }
    }
  }

  .top-recommendation-container {
    margin: 0 16px 16px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #fcd34d;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle at top right, rgba(252, 211, 77, 0.3), transparent 70%);
      z-index: 0;
    }

    .top-recommendation-header {
      margin-bottom: 16px;
      position: relative;
      z-index: 1;

      .top-recommendation-title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-size: 18px;
        font-weight: 700;
        color: #b45309;

        text {
          margin-left: 8px;
        }
      }

      .top-recommendation-subtitle {
        font-size: 13px;
        color: #6b7280;
      }
    }

    .top-recommendation-numbers {
      position: relative;
      z-index: 1;

      :deep(.prediction-set-container) {
        padding: 12px;
        margin-bottom: 0;
        background-color: #fef3c7;
        box-shadow: none;
        border-radius: 12px;
      }
    }
  }

  .prediction-sets-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 0 16px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    height: calc(100vh - 300px);
    min-height: 400px;
    padding: 16px;

    .prediction-sets-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}
</style>
