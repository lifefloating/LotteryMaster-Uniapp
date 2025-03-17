<template>
  <view class="lottery-switch-container">
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
      <view
        class="lottery-switch-item"
        :class="{
          active: activeType === 'fc3d',
          fc3d: activeType === 'fc3d',
        }"
        @click="handleSwitch('fc3d')"
      >
        <text class="lottery-switch-text">福彩3D</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
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

  .lottery-switch-wrapper {
    display: flex;
    height: 48px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .lottery-switch-item {
      display: flex;
      flex: 1;
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

        &.fc3d {
          background-color: #f59e0b;
        }

        .lottery-switch-text {
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
