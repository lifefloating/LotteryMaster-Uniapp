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
    :style="{
      paddingTop: safeAreaInsets?.top + 'px',
      paddingBottom: safeAreaInsets?.bottom + 'px',
    }"
  >
    <!-- 彩票类型切换 -->
    <lottery-type-switch
      :active-type="lotteryStore.currentLotteryType"
      @switch="handleLotteryTypeSwitch"
    />

    <!-- 预测号码展示区 -->
    <view class="prediction-title-container">
      <view
        class="report-button"
        v-if="lotteryStore.currentLotteryType !== 'fc3d'"
        @click="showReport = true"
      >
        <wd-icon name="data-analysis" size="14px" color="#FFFFFF" />
        <text class="report-button-text">查看分析报告</text>
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

    <!-- 分析报告组件 -->
    <analysis-report
      v-if="showReport && lotteryStore.currentLotteryType !== 'fc3d'"
      :visible="showReport"
      @close="showReport = false"
    />
  </view>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useLotteryStore, type LotteryType } from '@/store/lottery'

const LotteryHeader = defineAsyncComponent(() => import('@/components/LotteryHeader.vue'))
const LotteryTypeSwitch = defineAsyncComponent(() => import('@/components/LotteryTypeSwitch.vue'))
const LotteryNumberBall = defineAsyncComponent(() => import('@/components/LotteryNumberBall.vue'))
const LotteryPredictionSet = defineAsyncComponent(
  () => import('@/components/LotteryPredictionSet.vue'),
)
const AnalysisReport = defineAsyncComponent(() => import('@/components/AnalysisReport.vue'))

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

// 页面加载时获取数据
onLoad(() => {
  lotteryStore.fetchLotteryData()
})

// 页面行为
// 返回上一页
const handleBack = () => {
  uni.navigateBack()
}

// 彩种类型切换处理
const handleLotteryTypeSwitch = (type: LotteryType) => {
  lotteryStore.setLotteryType(type)
  lotteryStore.fetchLotteryData()
}
</script>

<style lang="scss" scoped>
.prediction-page {
  min-height: 100vh;
  background-color: #f5f7fa;

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
        box-shadow: 0 1px 2px rgba(59, 130, 246, 0.3);
        transform: scale(0.98);
      }

      .report-button-text {
        margin: 0 4px;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }

  .top-recommendation-container {
    margin: 0 16px 16px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #fcd34d;

    .top-recommendation-header {
      margin-bottom: 12px;

      .top-recommendation-title {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        font-size: 16px;
        font-weight: 600;
        color: #b45309;

        text {
          margin-left: 6px;
        }
      }

      .top-recommendation-subtitle {
        font-size: 12px;
        color: #6b7280;
      }
    }

    .top-recommendation-numbers {
      :deep(.prediction-set-container) {
        padding: 8px;
        margin-bottom: 0;
        background-color: #fef3c7;
        box-shadow: none;
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
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

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
}
</style>
