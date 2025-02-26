<template>
  <view class="prediction-set-container" :class="{ 'dark-theme': isDarkMode }">
    <view class="set-header">
      <view class="set-number">
        <text class="set-number-text">{{ setNumber }}</text>
      </view>
      <view class="set-title">
        <text class="set-title-text">预测号码</text>
      </view>
    </view>

    <view class="numbers-container">
      <view class="primary-numbers">
        <lottery-number-ball
          v-for="(num, index) in primaryNumbers"
          :key="index"
          :number="num"
          type="primary"
          :lottery-type="lotteryType"
        />
      </view>

      <view class="special-numbers">
        <lottery-number-ball
          v-for="(num, index) in specialNumbers"
          :key="index"
          :number="num"
          type="special"
          :lottery-type="lotteryType"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, PropType, defineAsyncComponent } from 'vue'
import { useThemeStore } from '@/store/theme'

const LotteryNumberBall = defineAsyncComponent(() => import('@/components/LotteryNumberBall.vue'))

defineOptions({
  name: 'LotteryPredictionSet',
})

const props = defineProps({
  setNumber: {
    type: [Number, String],
    required: true,
  },
  primaryNumbers: {
    type: Array as PropType<(number | string)[]>,
    required: true,
  },
  specialNumbers: {
    type: Array as PropType<(number | string)[]>,
    required: true,
  },
  lotteryType: {
    type: String,
    default: 'ssq', // 'ssq' or 'dlt'
  },
})

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkMode)
</script>

<style lang="scss" scoped>
.prediction-set-container {
  padding: 16px;
  margin-bottom: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &.dark-theme {
    background-color: #1f2937;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .set-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .set-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;

      .set-number-text {
        color: #ffffff;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .set-title {
      .set-title-text {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }
  }

  .numbers-container {
    display: flex;
    flex-direction: column;

    .primary-numbers,
    .special-numbers {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-bottom: 8px;
    }
  }

  &.dark-theme {
    .set-header {
      .set-number {
        background-color: #60a5fa;
      }

      .set-title {
        .set-title-text {
          color: #f9fafb;
        }
      }
    }
  }
}
</style>
