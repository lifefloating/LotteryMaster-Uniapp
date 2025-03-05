<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
}
</route>

<template>
  <view
    class="my-page"
    :style="{
      paddingTop: safeAreaInsets?.top + 'px',
      paddingBottom: safeAreaInsets?.bottom + 'px',
    }"
  >
    <!-- 用户信息区域 -->
    <view class="user-info-container">
      <view class="avatar-container">
        <view class="avatar">
          <text class="avatar-text">彩</text>
        </view>
      </view>
      <view class="user-details">
        <text class="username">彩票大师用户</text>
        <text class="user-desc">欢迎使用彩票大师</text>
      </view>
    </view>

    <!-- 设置选项列表 -->
    <view class="settings-container">
      <view class="settings-group">
        <view class="settings-title">
          <text class="title-text">应用设置</text>
        </view>

        <view class="settings-item">
          <view class="item-left">
            <text class="iconfont icon-notification">&#xe6ba;</text>
            <text class="item-text">开奖提醒</text>
          </view>
          <view class="item-right">
            <switch
              :checked="notificationEnabled"
              @change="handleNotificationChange"
              color="#3B82F6"
            />
          </view>
        </view>

        <view class="settings-item">
          <view class="item-left">
            <text class="iconfont icon-clear">&#xe6a9;</text>
            <text class="item-text">清除缓存</text>
          </view>
          <view class="item-right">
            <text class="iconfont icon-arrow">&#xe6a3;</text>
          </view>
        </view>
      </view>

      <view class="settings-group">
        <view class="settings-title">
          <text class="title-text">关于应用</text>
        </view>

        <view class="settings-item">
          <view class="item-left">
            <text class="iconfont icon-about">&#xe6a7;</text>
            <text class="item-text">关于我们</text>
          </view>
          <view class="item-right">
            <text class="iconfont icon-arrow">&#xe6a3;</text>
          </view>
        </view>

        <view class="settings-item">
          <view class="item-left">
            <text class="iconfont icon-feedback">&#xe6b2;</text>
            <text class="item-text">意见反馈</text>
          </view>
          <view class="item-right">
            <text class="iconfont icon-arrow">&#xe6a3;</text>
          </view>
        </view>

        <view class="settings-item">
          <view class="item-left">
            <text class="iconfont icon-version">&#xe6c7;</text>
            <text class="item-text">当前版本</text>
          </view>
          <view class="item-right">
            <text class="version-text">v2.5.5</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'

const LotteryHeader = defineAsyncComponent(() => import('@/components/LotteryHeader.vue'))

defineOptions({
  name: 'MyPage',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 通知开关状态
const notificationEnabled = ref(false)

// 处理返回按钮点击
const handleBack = () => {
  uni.navigateBack()
}

// 处理历史记录按钮点击
const handleHistory = () => {
  uni.navigateTo({
    url: '/pages-sub/history/index',
  })
}

// 处理通知开关
const handleNotificationChange = (e: any) => {
  notificationEnabled.value = e.detail.value
}
</script>

<style lang="scss" scoped>
.my-page {
  min-height: 100vh;
  background-color: #f5f7fa;

  .user-info-container {
    display: flex;
    align-items: center;
    padding: 20px;
    margin: 16px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .avatar-container {
      margin-right: 16px;

      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        background-color: #3b82f6;
        border-radius: 50%;

        .avatar-text {
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }

    .user-details {
      flex: 1;

      .username {
        display: block;
        margin-bottom: 4px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
      }

      .user-desc {
        font-size: 14px;
        color: #666666;
      }
    }
  }

  .settings-container {
    margin: 0 16px;

    .settings-group {
      margin-bottom: 24px;
      overflow: hidden;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      .settings-title {
        padding: 16px;
        border-bottom: 1px solid #f3f4f6;

        .title-text {
          font-size: 16px;
          font-weight: 500;
          color: #333333;
        }
      }

      .settings-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid #f3f4f6;

        &:last-child {
          border-bottom: none;
        }

        .item-left {
          display: flex;
          align-items: center;

          .iconfont {
            margin-right: 12px;
            font-size: 20px;
            color: #666666;
          }

          .item-text {
            font-size: 16px;
            color: #333333;
          }
        }

        .item-right {
          .iconfont {
            font-size: 16px;
            color: #999999;
          }

          .version-text {
            font-size: 14px;
            color: #999999;
          }
        }
      }
    }
  }
}
</style>
