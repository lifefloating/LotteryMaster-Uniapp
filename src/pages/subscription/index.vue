<route lang="json5">
{
  style: {
    navigationBarTitleText: '邮件订阅',
  },
}
</route>

<template>
  <view class="subscription-page">
    <!-- Email Config Section -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">📧 邮件配置</text>
        <text v-if="!hasEmailConfig" class="section-desc">配置 SMTP 服务器以发送邮件</text>
        <text v-else class="section-desc config-ok">✓ 已配置</text>
      </view>

      <view class="config-container">
        <button class="btn btn-primary" @tap="showEmailConfigModal = true">
          {{ hasEmailConfig ? '修改配置' : '配置邮件服务' }}
        </button>

        <button v-if="hasEmailConfig" class="btn btn-secondary" @tap="handleTestEmail">
          发送测试邮件
        </button>
      </view>
    </view>

    <!-- Subscriptions Section -->
    <view v-if="hasEmailConfig" class="section">
      <view class="section-header">
        <text class="section-title">📬 订阅列表</text>
        <button class="btn-add" @tap="handleAddSubscription">
          <text class="btn-add-text">+ 添加订阅</text>
        </button>
      </view>

      <view v-if="subscriptions.length === 0" class="empty-state">
        <text class="empty-text">暂无订阅</text>
        <text class="empty-desc">点击上方按钮添加订阅</text>
      </view>

      <view v-else class="subscription-list">
        <view
          v-for="sub in subscriptions"
          :key="sub.id"
          class="subscription-item"
          :class="{ disabled: !sub.enabled }"
        >
          <view class="sub-info">
            <view class="sub-header">
              <text class="sub-lottery">{{ getLotteryName(sub.lottery_type) }}</text>
              <switch
                :checked="sub.enabled"
                @change="(e) => handleToggleSubscription(sub.id, e.detail.value)"
              />
            </view>
            <text class="sub-email">{{ sub.to_email }}</text>
            <text class="sub-schedule">{{ formatSchedule(sub) }}</text>
          </view>
          <view class="sub-actions">
            <button class="btn-action" @tap="handleEditSubscription(sub)">编辑</button>
            <button class="btn-action btn-danger" @tap="handleDeleteSubscription(sub.id)">
              删除
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- Email Config Modal -->
    <view v-if="showEmailConfigModal" class="modal-overlay" @tap="handleModalOverlayClick">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">邮件配置</text>
          <text class="modal-close" @tap="showEmailConfigModal = false">✕</text>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">SMTP 服务器</text>
            <input
              v-model="emailForm.smtp_host"
              class="form-input"
              type="text"
              placeholder="如: smtp.gmail.com"
              @focus="handleInputFocus"
            />
          </view>
          <view class="form-group">
            <text class="form-label">端口</text>
            <input
              v-model.number="emailForm.smtp_port"
              type="number"
              class="form-input"
              placeholder="如: 587"
              @focus="handleInputFocus"
            />
          </view>
          <view class="form-group">
            <text class="form-label">使用 SSL/TLS</text>
            <switch
              :checked="emailForm.smtp_secure"
              @change="emailForm.smtp_secure = $event.detail.value"
            />
          </view>
          <view class="form-group">
            <text class="form-label">用户名</text>
            <input
              v-model="emailForm.smtp_user"
              class="form-input"
              type="text"
              placeholder="邮箱账号"
              @focus="handleInputFocus"
            />
          </view>
          <view class="form-group">
            <text class="form-label">密码</text>
            <input
              v-model="emailForm.smtp_pass"
              type="password"
              class="form-input"
              placeholder="邮箱密码或授权码"
              @focus="handleInputFocus"
            />
          </view>
          <view class="form-group">
            <text class="form-label">发件人邮箱</text>
            <input
              v-model="emailForm.from_email"
              class="form-input"
              type="text"
              placeholder="发件人邮箱地址"
              @focus="handleInputFocus"
            />
          </view>
          <view class="form-group">
            <text class="form-label">发件人名称</text>
            <input
              v-model="emailForm.from_name"
              class="form-input"
              type="text"
              placeholder="如: 彩票大师"
              @focus="handleInputFocus"
            />
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn btn-cancel" @tap="showEmailConfigModal = false">取消</button>
          <button class="btn btn-primary" @tap="handleSaveEmailConfig">保存</button>
        </view>
      </view>
    </view>

    <!-- Subscription Form Modal -->
    <view
      v-if="showSubscriptionModal"
      class="modal-overlay"
      @tap="handleSubscriptionModalOverlayClick"
    >
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">{{ isEditingSubscription ? '编辑订阅' : '添加订阅' }}</text>
          <text class="modal-close" @tap="showSubscriptionModal = false">✕</text>
        </view>
        <view class="modal-body">
          <view class="form-group">
            <text class="form-label">彩票类型</text>
            <picker
              mode="selector"
              :range="lotteryTypes"
              :range-key="'label'"
              :value="getLotteryTypeIndex(subscriptionForm.lottery_type)"
              @change="handleLotteryTypeChange"
            >
              <view class="picker-value">
                {{ getLotteryName(subscriptionForm.lottery_type) }}
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">接收邮箱</text>
            <input
              v-model="subscriptionForm.to_email"
              class="form-input"
              type="text"
              placeholder="输入接收预测邮件的邮箱"
              @focus="handleInputFocus"
            />
          </view>
          <view class="form-group">
            <text class="form-label">订阅频率</text>
            <picker
              mode="selector"
              :range="scheduleTypes"
              :range-key="'label'"
              :value="getScheduleTypeIndex(subscriptionForm.schedule_type)"
              @change="handleScheduleTypeChange"
            >
              <view class="picker-value">
                {{ subscriptionForm.schedule_type === 'daily' ? '每天' : '每周' }}
              </view>
            </picker>
          </view>
          <view v-if="subscriptionForm.schedule_type === 'weekly'" class="form-group">
            <text class="form-label">星期几</text>
            <picker
              mode="selector"
              :range="weekdays"
              :value="subscriptionForm.schedule_weekday || 0"
              @change="handleWeekdayChange"
            >
              <view class="picker-value">
                {{ weekdays[subscriptionForm.schedule_weekday || 0] }}
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">发送时间</text>
            <picker mode="time" :value="subscriptionForm.schedule_time" @change="handleTimeChange">
              <view class="picker-value">
                {{ subscriptionForm.schedule_time }}
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">启用订阅</text>
            <switch
              :checked="subscriptionForm.enabled"
              @change="subscriptionForm.enabled = $event.detail.value"
            />
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn btn-cancel" @tap="showSubscriptionModal = false">取消</button>
          <button class="btn btn-primary" @tap="handleSaveSubscription">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useSubscriptionStore } from '@/store/subscription'
import type {
  CreateEmailConfigInput,
  CreateSubscriptionInput,
  Subscription,
} from '@/store/subscription'

defineOptions({
  name: 'SubscriptionPage',
})

const subscriptionStore = useSubscriptionStore()

// Computed
const hasEmailConfig = computed(() => subscriptionStore.hasEmailConfig)
const subscriptions = computed(() => subscriptionStore.subscriptions)

// Email config modal
const showEmailConfigModal = ref(false)
const emailForm = ref<CreateEmailConfigInput>({
  smtp_host: '',
  smtp_port: 587,
  smtp_secure: false,
  smtp_user: '',
  smtp_pass: '',
  from_email: '',
  from_name: '彩票大师',
})

// Subscription modal
const showSubscriptionModal = ref(false)
const isEditingSubscription = ref(false)
const editingSubscriptionId = ref<number | null>(null)
const subscriptionForm = ref<CreateSubscriptionInput>({
  to_email: '',
  lottery_type: 'ssq',
  schedule_type: 'daily',
  schedule_time: '09:00',
  schedule_weekday: 1,
  enabled: true,
})

// Options
const lotteryTypes = [
  { value: 'ssq', label: '双色球' },
  { value: 'dlt', label: '大乐透' },
  { value: 'fc3d', label: '福彩3D' },
]

const scheduleTypes = [
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
]

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// Methods
const getLotteryName = (type: string) => {
  return lotteryTypes.find((t) => t.value === type)?.label || type
}

const getLotteryTypeIndex = (type: string) => {
  return lotteryTypes.findIndex((t) => t.value === type)
}

const getScheduleTypeIndex = (type: string) => {
  return scheduleTypes.findIndex((t) => t.value === type)
}

const formatSchedule = (sub: Subscription) => {
  if (sub.schedule_type === 'daily') {
    return `每天 ${sub.schedule_time}`
  } else {
    const weekday = weekdays[sub.schedule_weekday || 0]
    return `每${weekday} ${sub.schedule_time}`
  }
}

const handleLotteryTypeChange = (e: any) => {
  subscriptionForm.value.lottery_type = lotteryTypes[e.detail.value].value as any
}

const handleScheduleTypeChange = (e: any) => {
  subscriptionForm.value.schedule_type = scheduleTypes[e.detail.value].value as any
}

const handleWeekdayChange = (e: any) => {
  subscriptionForm.value.schedule_weekday = e.detail.value
}

const handleTimeChange = (e: any) => {
  subscriptionForm.value.schedule_time = e.detail.value
}

const handleSaveEmailConfig = async () => {
  const success = await subscriptionStore.saveEmailConfig(emailForm.value)
  if (success) {
    showEmailConfigModal.value = false
  }
}

const handleTestEmail = () => {
  uni.showModal({
    title: '发送测试邮件',
    editable: true,
    placeholderText: '请输入接收邮箱',
    success: async (res) => {
      if (res.confirm && res.content) {
        await subscriptionStore.sendTestEmail(res.content)
      }
    },
  })
}

const handleAddSubscription = () => {
  isEditingSubscription.value = false
  editingSubscriptionId.value = null
  subscriptionForm.value = {
    to_email: '',
    lottery_type: 'ssq',
    schedule_type: 'daily',
    schedule_time: '09:00',
    schedule_weekday: 1,
    enabled: true,
  }
  showSubscriptionModal.value = true
}

const handleEditSubscription = (sub: Subscription) => {
  isEditingSubscription.value = true
  editingSubscriptionId.value = sub.id
  subscriptionForm.value = {
    to_email: sub.to_email,
    lottery_type: sub.lottery_type,
    schedule_type: sub.schedule_type,
    schedule_time: sub.schedule_time,
    schedule_weekday: sub.schedule_weekday,
    enabled: sub.enabled,
  }
  showSubscriptionModal.value = true
}

const handleSaveSubscription = async () => {
  if (isEditingSubscription.value && editingSubscriptionId.value) {
    const success = await subscriptionStore.updateSubscription(
      editingSubscriptionId.value,
      subscriptionForm.value,
    )
    if (success) {
      showSubscriptionModal.value = false
    }
  } else {
    const success = await subscriptionStore.createSubscription(subscriptionForm.value)
    if (success) {
      showSubscriptionModal.value = false
    }
  }
}

const handleToggleSubscription = async (id: number, enabled: boolean) => {
  await subscriptionStore.updateSubscription(id, { enabled })
}

const handleDeleteSubscription = (id: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除此订阅吗？',
    success: async (res) => {
      if (res.confirm) {
        await subscriptionStore.deleteSubscription(id)
      }
    },
  })
}

// Handle input focus (for debugging)
const handleInputFocus = (e: any) => {
  console.log('Input focused:', e)
}

// Handle modal overlay click
const handleModalOverlayClick = (e: any) => {
  // Only close if clicking the overlay itself, not its children
  if (e.target === e.currentTarget) {
    showEmailConfigModal.value = false
  }
}

const handleSubscriptionModalOverlayClick = (e: any) => {
  // Only close if clicking the overlay itself, not its children
  if (e.target === e.currentTarget) {
    showSubscriptionModal.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await subscriptionStore.fetchEmailConfig()
  if (hasEmailConfig.value) {
    await subscriptionStore.fetchSubscriptions()
  }

  // Load email config if exists
  if (subscriptionStore.emailConfig) {
    emailForm.value = {
      smtp_host: subscriptionStore.emailConfig.smtp_host,
      smtp_port: subscriptionStore.emailConfig.smtp_port,
      smtp_secure: subscriptionStore.emailConfig.smtp_secure,
      smtp_user: subscriptionStore.emailConfig.smtp_user,
      smtp_pass: subscriptionStore.emailConfig.smtp_pass,
      from_email: subscriptionStore.emailConfig.from_email,
      from_name: subscriptionStore.emailConfig.from_name,
    }
  }
})
</script>

<style lang="scss" scoped>
.subscription-page {
  min-height: 100vh;
  padding: 16px;
  background-color: #f5f7fa;
}

.section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 16px;

  .section-title {
    display: block;
    margin-bottom: 4px;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
  }

  .section-desc {
    display: block;
    font-size: 14px;
    color: #666666;

    &.config-ok {
      color: #10b981;
    }
  }

  .btn-add {
    float: right;
    padding: 6px 12px;
    font-size: 14px;
    color: #3b82f6;
    background-color: transparent;
    border: 1px solid #3b82f6;
    border-radius: 6px;

    &-text {
      font-size: 14px;
    }
  }
}

.config-container {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border-radius: 8px;
  border: none;

  &-primary {
    color: #ffffff;
    background-color: #3b82f6;
  }

  &-secondary {
    color: #3b82f6;
    background-color: #eff6ff;
  }

  &-cancel {
    color: #666666;
    background-color: #f3f4f6;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;

  .empty-text {
    margin-bottom: 8px;
    font-size: 16px;
    color: #666666;
  }

  .empty-desc {
    font-size: 14px;
    color: #999999;
  }
}

.subscription-list {
  .subscription-item {
    padding: 16px;
    margin-bottom: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;

    &.disabled {
      opacity: 0.6;
    }

    .sub-info {
      margin-bottom: 12px;

      .sub-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .sub-lottery {
          font-size: 16px;
          font-weight: 600;
          color: #333333;
        }
      }

      .sub-email {
        display: block;
        margin-bottom: 4px;
        font-size: 14px;
        color: #666666;
      }

      .sub-schedule {
        display: block;
        font-size: 14px;
        color: #999999;
      }
    }

    .sub-actions {
      display: flex;
      gap: 8px;

      .btn-action {
        flex: 1;
        padding: 8px;
        font-size: 14px;
        color: #3b82f6;
        background-color: #ffffff;
        border: 1px solid #3b82f6;
        border-radius: 6px;

        &.btn-danger {
          color: #ef4444;
          border-color: #ef4444;
        }
      }
    }
  }
}

// Modal styles
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  margin: auto;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 12px;
  z-index: 1001;
  pointer-events: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #333333;
  }

  .modal-close {
    font-size: 24px;
    color: #999999;
    cursor: pointer;
  }
}

.modal-body {
  padding: 16px;
  pointer-events: auto;

  .form-group {
    margin-bottom: 16px;
    pointer-events: auto;

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }

    .form-input {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      color: #333333;
      background-color: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      box-sizing: border-box;
      pointer-events: auto !important;
      cursor: text;
      user-select: text;
      -webkit-user-select: text;
    }

    .picker-value {
      padding: 10px 12px;
      font-size: 14px;
      color: #333333;
      background-color: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
    }
  }
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #f3f4f6;
}
</style>
