<template>
  <view
    class="header-container flex items-center justify-between px-4 py-3"
    :class="{ 'dark-header': isDarkMode }"
  >
    <view class="left-section">
      <view class="back-button" @click="handleBack">
        <text class="iconfont icon-back">&#xe6db;</text>
      </view>
    </view>
    <view class="title-section">
      <text class="title-text">{{ title }}</text>
    </view>
    <view class="right-section">
      <view class="history-button" @click="handleHistory">
        <text class="iconfont icon-history">&#xe6b5;</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'

defineOptions({
  name: 'LotteryHeader',
})

const props = defineProps({
  title: {
    type: String,
    default: '彩票大师',
  },
})

const emit = defineEmits(['back', 'history'])

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkMode)

const handleBack = () => {
  emit('back')
}

const handleHistory = () => {
  emit('history')
}
</script>

<style lang="scss" scoped>
.header-container {
  position: relative;
  height: 56px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &.dark-header {
    background-color: #1f2937;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .left-section,
  .right-section {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-button,
  .history-button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    .iconfont {
      font-size: 20px;
      color: #333333;
    }
  }

  .title-section {
    flex: 1;
    text-align: center;

    .title-text {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
    }
  }

  &.dark-header {
    .back-button,
    .history-button {
      .iconfont {
        color: #f9fafb;
      }
    }

    .title-section {
      .title-text {
        color: #f9fafb;
      }
    }
  }
}
</style>
