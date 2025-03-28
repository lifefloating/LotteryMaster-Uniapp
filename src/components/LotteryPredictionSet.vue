<template>
  <view class="prediction-set-container">
    <view class="numbers-container">
      <view class="primary-numbers">
        <view class="zone-label">{{ getPrimaryZoneLabel }}</view>
        <lottery-number-ball
          v-for="(num, index) in primaryNumbers"
          :key="index"
          :number="num"
          type="primary"
          :lottery-type="lotteryType"
        />
      </view>

      <view class="special-numbers" v-if="!isFc3dType">
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
import { PropType, computed } from 'vue'
import LotteryNumberBall from '@/components/LotteryNumberBall.vue'

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

// 检查是否是fc3d类型
const isFc3dType = computed(() => {
  return props.lotteryType === 'fc3d'
})

const getPrimaryZoneLabel = computed(() => {
  if (isFc3dType.value) {
    return '号码'
  }
  return '前区'
})
</script>

<style lang="scss" scoped>
.prediction-set-container {
  position: relative;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

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
}
</style>
