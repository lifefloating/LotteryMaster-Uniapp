<template>
  <view class="prediction-set-container" :class="{ 'dark-theme': isDarkMode }">
    <view class="numbers-container">
      <view class="primary-numbers">
        <view class="zone-label">前区</view>
        <lottery-number-ball
          v-for="(num, index) in primaryNumbers"
          :key="index"
          :number="num"
          type="primary"
          :lottery-type="lotteryType"
        />
      </view>

      <view class="special-numbers">
        <view class="zone-label">后区</view>
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
  lotteryType: {
    type: String,
    required: true,
  },
  primaryNumbers: {
    type: Array as PropType<(string | number)[]>,
    required: true,
  },
  specialNumbers: {
    type: Array as PropType<(string | number)[]>,
    required: true,
  },
})

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkMode)
</script>

<style lang="scss" scoped>
.prediction-set-container {
  position: relative;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &.dark-theme {
    background-color: #1f2937;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .numbers-container {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .primary-numbers,
    .special-numbers {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      padding: 8px 4px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }

      .zone-label {
        position: relative;
        flex-shrink: 0;
        padding-left: 4px;
        margin-right: 8px;
        font-size: 13px;
        font-weight: 500;
        color: #666666;

        &::after {
          position: absolute;
          top: 50%;
          left: -4px;
          width: 2px;
          height: 12px;
          content: '';
          background-color: #3b82f6;
          border-radius: 1px;
          transform: translateY(-50%);
        }
      }

      :deep(.lottery-number-ball) {
        flex-shrink: 0;
        margin: 0 4px;
      }
    }

    .special-numbers {
      .zone-label::after {
        background-color: #ef4444;
      }
    }
  }

  &.dark-theme {
    .numbers-container {
      .primary-numbers,
      .special-numbers {
        .zone-label {
          color: #d1d5db;
        }
      }
    }
  }
}
</style>
