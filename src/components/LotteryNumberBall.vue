<template>
  <view
    class="number-ball"
    :class="{
      'ssq-primary-ball': lotteryType === 'ssq' && type === 'primary',
      'ssq-special-ball': lotteryType === 'ssq' && type === 'special',
      'dlt-primary-ball': lotteryType === 'dlt' && type === 'primary',
      'dlt-special-ball': lotteryType === 'dlt' && type === 'special',
    }"
  >
    <text class="number-text">{{ number }}</text>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'LotteryNumberBall',
})

const props = defineProps({
  number: {
    type: [Number, String],
    required: true,
  },
  type: {
    type: String,
    default: 'primary', // 'primary' or 'special'
  },
  lotteryType: {
    type: String,
    default: 'ssq', // 'ssq' or 'dlt'
  },
})
</script>

<style lang="scss" scoped>
.number-ball {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 4px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
  /* 双色球：前6位蓝色，后1位红色 */
  &.ssq-primary-ball {
    background-color: #3498db; /* 蓝色 */

    .number-text {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
    }
  }

  &.ssq-special-ball {
    background-color: #e74c3c; /* 红色 */

    .number-text {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
    }
  }
  /* 大乐透：前5位蓝色，后2位红色 */
  &.dlt-primary-ball {
    background-color: #3498db; /* 蓝色 */

    .number-text {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
    }
  }

  &.dlt-special-ball {
    background-color: #e74c3c; /* 红色 */

    .number-text {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>
