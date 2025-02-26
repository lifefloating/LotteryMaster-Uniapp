<template>
  <view class="history-container">
    <lottery-header title="历史记录" @back="handleBack" />

    <view class="history-content">
      <!-- 历史记录内容 -->
      <text>历史记录页面</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const LotteryHeader = defineAsyncComponent(() => import('@/components/LotteryHeader.vue'))

defineOptions({
  name: 'HistoryPage',
})

const handleBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.history-container {
  min-height: 100vh;
  background-color: #f5f7fa;

  .history-content {
    padding: 16px;
  }
}
</style>
