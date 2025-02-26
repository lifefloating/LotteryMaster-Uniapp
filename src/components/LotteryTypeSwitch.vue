<template>
  <view class="lottery-switch-container" :class="{ 'dark-theme': isDarkMode }">
    <view class="lottery-switch-wrapper">
      <view
        class="lottery-switch-item"
        :class="{
          active: activeType === 'ssq',
          ssq: activeType === 'ssq',
        }"
        @click="handleSwitch('ssq')"
      >
        <text class="lottery-switch-text">双色球</text>
      </view>
      <view
        class="lottery-switch-item"
        :class="{
          active: activeType === 'dlt',
          dlt: activeType === 'dlt',
        }"
        @click="handleSwitch('dlt')"
      >
        <text class="lottery-switch-text">大乐透</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'

defineOptions({
  name: 'LotteryTypeSwitch',
})

const props = defineProps({
  activeType: {
    type: String,
    default: 'ssq', // 默认为双色球
  },
})

const emit = defineEmits(['switch'])

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkMode)

const handleSwitch = (type: string) => {
  if (type !== props.activeType) {
    emit('switch', type)
  }
}
</script>

<style lang="scss" scoped>
.lottery-switch-container {
  padding: 8px 16px;
  background-color: #f5f7fa;

  &.dark-theme {
    background-color: #111827;
  }

  .lottery-switch-wrapper {
    display: flex;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .lottery-switch-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      .lottery-switch-text {
        font-size: 16px;
        font-weight: 500;
        color: #666666;
      }

      &.active {
        &.ssq {
          background-color: #3b82f6;
        }

        &.dlt {
          background-color: #10b981;
        }

        .lottery-switch-text {
          color: #ffffff;
          font-weight: bold;
        }
      }
    }
  }

  &.dark-theme {
    .lottery-switch-wrapper {
      background-color: #1f2937;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

      .lottery-switch-item {
        .lottery-switch-text {
          color: #d1d5db;
        }

        &.active {
          &.ssq {
            background-color: #60a5fa;
          }

          &.dlt {
            background-color: #34d399;
          }

          .lottery-switch-text {
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
