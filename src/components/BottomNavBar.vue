<template>
  <view class="bottom-nav-container">
    <view
      class="nav-item"
      :class="{ active: activeTab === 'home' }"
      @click="handleTabChange('home')"
    >
      <view class="nav-icon">
        <image :src="tabbarPredict" mode="aspectFit" />
      </view>
      <text class="nav-text" :class="{ active: activeTab === 'home' }">预测</text>
    </view>

    <view
      class="nav-item"
      :class="{ active: activeTab === 'trends' }"
      @click="handleTabChange('trends')"
    >
      <view class="nav-icon">
        <image :src="tabbarTrends" mode="aspectFit" />
      </view>
      <text class="nav-text" :class="{ active: activeTab === 'trends' }">走势</text>
    </view>

    <view class="nav-item" :class="{ active: activeTab === 'my' }" @click="handleTabChange('my')">
      <view class="nav-icon">
        <image :src="tabbarMy" mode="aspectFit" />
      </view>
      <text class="nav-text" :class="{ active: activeTab === 'my' }">我的</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import tabbarPredict from '@/static/tabbar/icons/tabbar_predict.png'
import tabbarTrends from '@/static/tabbar/icons/tabbar_trends.png'
import tabbarMy from '@/static/tabbar/icons/tabbar_my.png'

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
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

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
}
</style>
