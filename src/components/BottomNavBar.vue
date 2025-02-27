<template>
  <view class="bottom-nav-container" :class="{ 'dark-theme': isDarkMode }">
    <view
      class="nav-item"
      :class="{ active: activeTab === 'home' }"
      @click="handleTabChange('home')"
    >
      <view class="nav-icon">
        <image src="/static/icons/tabbar_predict.png" mode="aspectFit" />
      </view>
      <text class="nav-text" :class="{ active: activeTab === 'home' }">预测</text>
    </view>

    <view
      class="nav-item"
      :class="{ active: activeTab === 'trends' }"
      @click="handleTabChange('trends')"
    >
      <view class="nav-icon">
        <image src="/static/icons/tabbar_trends.png" mode="aspectFit" />
      </view>
      <text class="nav-text" :class="{ active: activeTab === 'trends' }">走势</text>
    </view>

    <view class="nav-item" :class="{ active: activeTab === 'my' }" @click="handleTabChange('my')">
      <view class="nav-icon">
        <image src="/static/icons/tabbar_my.png" mode="aspectFit" />
      </view>
      <text class="nav-text" :class="{ active: activeTab === 'my' }">我的</text>
    </view>
  </view>
</template>

<script lang="ts"></script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'

defineOptions({
  name: 'BottomNavBar',
})

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
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  height: 64px;
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  &.dark-theme {
    background-color: #1f2937;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  }

  .nav-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 0;

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-bottom: 4px;

      image {
        width: 24px;
        height: 24px;
      }
    }

    .nav-text {
      font-size: 12px;
      color: #666666;

      &.active {
        font-weight: 500;
        color: #3b82f6;
      }
    }
  }

  &.dark-theme {
    .nav-item {
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
