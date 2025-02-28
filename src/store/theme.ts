import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // 移除深色模式状态
  }),
  actions: {
    // 移除深色模式相关方法
  },
  persist: {
    key: 'theme-storage',
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
