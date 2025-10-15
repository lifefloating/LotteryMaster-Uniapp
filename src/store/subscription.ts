import { defineStore } from 'pinia'

// Email configuration interface
export interface EmailConfig {
  id: number
  smtp_host: string
  smtp_port: number
  smtp_secure: boolean
  smtp_user: string
  smtp_pass: string
  from_email: string
  from_name: string
  created_at: string
  updated_at: string
}

// Subscription interface
export interface Subscription {
  id: number
  to_email: string
  lottery_type: 'ssq' | 'dlt' | 'fc3d'
  schedule_type: 'daily' | 'weekly'
  schedule_time: string // HH:mm format
  schedule_weekday?: number // 0-6 (0=Sunday)
  enabled: boolean
  created_at: string
  updated_at: string
}

// Input types for API
export interface CreateEmailConfigInput {
  smtp_host: string
  smtp_port: number
  smtp_secure: boolean
  smtp_user: string
  smtp_pass: string
  from_email: string
  from_name: string
}

export interface CreateSubscriptionInput {
  to_email: string
  lottery_type: 'ssq' | 'dlt' | 'fc3d'
  schedule_type: 'daily' | 'weekly'
  schedule_time: string
  schedule_weekday?: number
  enabled?: boolean
}

export interface UpdateSubscriptionInput {
  to_email?: string
  lottery_type?: 'ssq' | 'dlt' | 'fc3d'
  schedule_type?: 'daily' | 'weekly'
  schedule_time?: string
  schedule_weekday?: number
  enabled?: boolean
}

interface SubscriptionState {
  emailConfig: EmailConfig | null
  subscriptions: Subscription[]
  isLoading: boolean
  error: string | null
}

export const useSubscriptionStore = defineStore('subscription', {
  state: (): SubscriptionState => ({
    emailConfig: null,
    subscriptions: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    hasEmailConfig(): boolean {
      return !!this.emailConfig
    },
    enabledSubscriptions(): Subscription[] {
      return this.subscriptions.filter((sub) => sub.enabled)
    },
  },

  actions: {
    // Email Config Actions
    async fetchEmailConfig(): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const res = (await new Promise((resolve, reject) => {
          uni.request({
            url: '/api/subscription/email-config',
            method: 'GET',
            success: resolve,
            fail: reject,
          })
        })) as any

        if (res.statusCode === 200 && res.data?.success) {
          this.emailConfig = res.data.data
        } else {
          this.emailConfig = null
        }
      } catch (err: any) {
        console.error('Error fetching email config:', err)
        this.error = err.message || '获取邮件配置失败'
        this.emailConfig = null
      } finally {
        this.isLoading = false
      }
    },

    async saveEmailConfig(config: CreateEmailConfigInput): Promise<boolean> {
      this.isLoading = true
      this.error = null

      try {
        const res = (await new Promise((resolve, reject) => {
          uni.request({
            url: '/api/subscription/email-config',
            method: 'POST',
            data: config,
            success: resolve,
            fail: reject,
          })
        })) as any

        if (res.statusCode === 200 && res.data?.success) {
          this.emailConfig = res.data.data
          uni.showToast({
            title: '邮件配置保存成功',
            icon: 'success',
          })
          return true
        } else {
          throw new Error(res.data?.message || '保存失败')
        }
      } catch (err: any) {
        console.error('Error saving email config:', err)
        this.error = err.message || '保存邮件配置失败'
        uni.showToast({
          title: this.error,
          icon: 'error',
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    async deleteEmailConfig(): Promise<boolean> {
      this.isLoading = true
      this.error = null

      try {
        const res = (await new Promise((resolve, reject) => {
          uni.request({
            url: '/api/subscription/email-config',
            method: 'DELETE',
            success: resolve,
            fail: reject,
          })
        })) as any

        if (res.statusCode === 200 && res.data?.success) {
          this.emailConfig = null
          uni.showToast({
            title: '邮件配置已删除',
            icon: 'success',
          })
          return true
        } else {
          throw new Error(res.data?.message || '删除失败')
        }
      } catch (err: any) {
        console.error('Error deleting email config:', err)
        this.error = err.message || '删除邮件配置失败'
        uni.showToast({
          title: this.error,
          icon: 'error',
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    async sendTestEmail(toEmail: string): Promise<boolean> {
      this.isLoading = true
      this.error = null

      try {
        const res = (await new Promise((resolve, reject) => {
          uni.request({
            url: '/api/subscription/test-email',
            method: 'POST',
            data: { toEmail },
            success: resolve,
            fail: reject,
          })
        })) as any

        if (res.statusCode === 200 && res.data?.success) {
          uni.showToast({
            title: '测试邮件发送成功',
            icon: 'success',
          })
          return true
        } else {
          throw new Error(res.data?.message || '发送失败')
        }
      } catch (err: any) {
        console.error('Error sending test email:', err)
        this.error = err.message || '发送测试邮件失败'
        uni.showToast({
          title: this.error,
          icon: 'error',
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    // Subscription Actions
    async fetchSubscriptions(): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const res = (await new Promise((resolve, reject) => {
          uni.request({
            url: '/api/subscription',
            method: 'GET',
            success: resolve,
            fail: reject,
          })
        })) as any

        if (res.statusCode === 200 && res.data?.success) {
          this.subscriptions = res.data.data || []
        } else {
          throw new Error(res.data?.message || '获取失败')
        }
      } catch (err: any) {
        console.error('Error fetching subscriptions:', err)
        this.error = err.message || '获取订阅列表失败'
        this.subscriptions = []
      } finally {
        this.isLoading = false
      }
    },

    async createSubscription(input: CreateSubscriptionInput): Promise<boolean> {
      this.isLoading = true
      this.error = null

      try {
        const res = (await new Promise((resolve, reject) => {
          uni.request({
            url: '/api/subscription',
            method: 'POST',
            data: input,
            success: resolve,
            fail: reject,
          })
        })) as any

        if (res.statusCode === 200 && res.data?.success) {
          await this.fetchSubscriptions() // Refresh list
          uni.showToast({
            title: '订阅创建成功',
            icon: 'success',
          })
          return true
        } else {
          throw new Error(res.data?.message || '创建失败')
        }
      } catch (err: any) {
        console.error('Error creating subscription:', err)
        this.error = err.message || '创建订阅失败'
        uni.showToast({
          title: this.error,
          icon: 'error',
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    async updateSubscription(id: number, input: UpdateSubscriptionInput): Promise<boolean> {
      this.isLoading = true
      this.error = null

      try {
        const res = (await new Promise((resolve, reject) => {
          uni.request({
            url: `/api/subscription/${id}`,
            method: 'PUT',
            data: input,
            success: resolve,
            fail: reject,
          })
        })) as any

        if (res.statusCode === 200 && res.data?.success) {
          await this.fetchSubscriptions() // Refresh list
          uni.showToast({
            title: '订阅更新成功',
            icon: 'success',
          })
          return true
        } else {
          throw new Error(res.data?.message || '更新失败')
        }
      } catch (err: any) {
        console.error('Error updating subscription:', err)
        this.error = err.message || '更新订阅失败'
        uni.showToast({
          title: this.error,
          icon: 'error',
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    async deleteSubscription(id: number): Promise<boolean> {
      this.isLoading = true
      this.error = null

      try {
        const res = (await new Promise((resolve, reject) => {
          uni.request({
            url: `/api/subscription/${id}`,
            method: 'DELETE',
            success: resolve,
            fail: reject,
          })
        })) as any

        if (res.statusCode === 200 && res.data?.success) {
          await this.fetchSubscriptions() // Refresh list
          uni.showToast({
            title: '订阅删除成功',
            icon: 'success',
          })
          return true
        } else {
          throw new Error(res.data?.message || '删除失败')
        }
      } catch (err: any) {
        console.error('Error deleting subscription:', err)
        this.error = err.message || '删除订阅失败'
        uni.showToast({
          title: this.error,
          icon: 'error',
        })
        return false
      } finally {
        this.isLoading = false
      }
    },

    async sendPreviewEmail(lotteryType: 'ssq' | 'dlt' | 'fc3d', toEmail: string): Promise<boolean> {
      this.isLoading = true
      this.error = null

      try {
        const res = (await new Promise((resolve, reject) => {
          uni.request({
            url: '/api/subscription/preview',
            method: 'POST',
            data: { lotteryType, toEmail },
            success: resolve,
            fail: reject,
          })
        })) as any

        if (res.statusCode === 200 && res.data?.success) {
          uni.showToast({
            title: '预览邮件发送成功',
            icon: 'success',
          })
          return true
        } else {
          throw new Error(res.data?.message || '发送失败')
        }
      } catch (err: any) {
        console.error('Error sending preview email:', err)
        this.error = err.message || '发送预览邮件失败'
        uni.showToast({
          title: this.error,
          icon: 'error',
        })
        return false
      } finally {
        this.isLoading = false
      }
    },
  },

  persist: {
    key: 'subscription-storage',
    storage: {
      getItem: (key) => {
        return uni.getStorageSync(key)
      },
      setItem: (key, value) => {
        uni.setStorageSync(key, value)
      },
    },
  },
})
