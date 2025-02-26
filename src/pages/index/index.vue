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
    <view class="prediction-numbers-container">
      <view class="prediction-title">
        <text class="title-text">预测号码</text>
      </view>

      <view class="prediction-numbers">
        <view class="number-balls-container">
          <lottery-number-ball
            v-for="(num, index) in topPrediction.primaryNumbers"
            :key="'primary-' + index"
            :number="num"
            type="primary"
            :lottery-type="lotteryStore.currentLotteryType"
          />

          <lottery-number-ball
            v-for="(num, index) in topPrediction.specialNumbers"
            :key="'special-' + index"
            :number="num"
            type="special"
            :lottery-type="lotteryStore.currentLotteryType"
          />
        </view>
      </view>
    </view>

    <!-- 多组预测号码列表 -->
    <view class="prediction-sets-container">
      <view class="prediction-sets-title">
        <text class="title-text">组号</text>
        <text class="title-text">预测号码</text>
        <text class="title-text">特殊号</text>
      </view>

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
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useThemeStore } from '@/store/theme'
import { useLotteryStore } from '@/store/lottery'
import * as LotteryHeader from '@/components/LotteryHeader.vue'
import * as LotteryTypeSwitch from '@/components/LotteryTypeSwitch.vue'
import * as LotteryNumberBall from '@/components/LotteryNumberBall.vue'
import * as LotteryPredictionSet from '@/components/LotteryPredictionSet.vue'
import * as BottomNavBar from '@/components/BottomNavBar.vue'

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
const handleLotteryTypeSwitch = (type: string) => {
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
        font-size: 14px;
        color: #666666;
        margin-bottom: 4px;
      }

      .info-value {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }
  }

  .prediction-numbers-container {
    margin: 0 16px 16px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .prediction-title {
      margin-bottom: 16px;

      .title-text {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }

    .prediction-numbers {
      .number-balls-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }

  .prediction-sets-container {
    margin: 0 16px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .prediction-sets-title {
      display: flex;
      padding: 0 16px 8px;

      .title-text {
        flex: 1;
        font-size: 14px;
        color: #666666;

        &:first-child {
          flex: 0 0 60px;
        }

        &:last-child {
          flex: 0 0 80px;
          text-align: right;
        }
      }
    }

    .prediction-sets-scroll {
      flex: 1;
      height: 400px;
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

    .prediction-numbers-container {
      background-color: #1f2937;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      .prediction-title {
        .title-text {
          color: #f9fafb;
        }
      }
    }

    .prediction-sets-container {
      .prediction-sets-title {
        .title-text {
          color: #d1d5db;
        }
      }
    }
  }
}
</style>
