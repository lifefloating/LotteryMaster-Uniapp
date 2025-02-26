<template>
  <view
    class="number-ball"
    :class="{
      'primary-ball': type === 'primary',
      'special-ball': type === 'special',
      'dark-theme': isDarkMode,
    }"
  >
    <text class="number-text">{{ number }}</text>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'

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

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkMode)
</script>

<style lang="scss" scoped>
.number-ball {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }

  &.primary-ball {
    background-color: #3b82f6;

    .number-text {
      color: #ffffff;
      font-weight: bold;
      font-size: 16px;
    }
  }

  &.special-ball {
    background-color: #f3f4f6;

    .number-text {
      color: #333333;
      font-weight: bold;
      font-size: 16px;
    }
  }

  &.dark-theme {
    &.primary-ball {
      background-color: #60a5fa;
    }

    &.special-ball {
      background-color: #374151;

      .number-text {
        color: #f9fafb;
      }
    }
  }
}
</style>
