<template>
  <view class="bottom-nav-container" :class="{ 'dark-theme': isDarkMode }">
    <view
      class="nav-item"
      :class="{ active: activeTab === 'home' }"
      @click="handleTabChange('home')"
    >
      <view class="nav-icon">
        <view class="i-carbon-lightning" :class="{ active: activeTab === 'home' }" />
      </view>
      <text class="nav-text" :class="{ active: activeTab === 'home' }">预测</text>
    </view>

    <view
      class="nav-item"
      :class="{ active: activeTab === 'trends' }"
      @click="handleTabChange('trends')"
    >
      <view class="nav-icon">
        <view class="i-carbon-analytics" :class="{ active: activeTab === 'trends' }" />
      </view>
      <text class="nav-text" :class="{ active: activeTab === 'trends' }">走势</text>
    </view>

    <view class="nav-item" :class="{ active: activeTab === 'my' }" @click="handleTabChange('my')">
      <view class="nav-icon">
        <view class="i-carbon-user-avatar" :class="{ active: activeTab === 'my' }" />
      </view>
      <text class="nav-text" :class="{ active: activeTab === 'my' }">我的</text>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'BottomNavBar',
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'home',
  },
})

const emit = defineEmits(['tab-change'])

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkMode)

const handleTabChange = (tab: string) => {
  if (tab !== props.activeTab) {
    emit('tab-change', tab)
  }
}
</script>

<style lang="scss" scoped>
.bottom-nav-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;

  &.dark-theme {
    background-color: #1f2937;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 0;

    .nav-icon {
      margin-bottom: 4px;
      height: 24px;
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      view {
        width: 100%;
        height: 100%;
        color: #666666;

        &.active {
          color: #3b82f6;
        }
      }
    }

    .nav-text {
      font-size: 12px;
      color: #666666;

      &.active {
        color: #3b82f6;
        font-weight: 500;
      }
    }
  }

  &.dark-theme {
    .nav-item {
      .nav-icon {
        view {
          color: #d1d5db;

          &.active {
            color: #60a5fa;
          }
        }
      }

      .nav-text {
        color: #d1d5db;

        &.active {
          color: #60a5fa;
        }
      }
    }
  }
}
</style>
