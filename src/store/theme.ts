import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: false,
  }),
  actions: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
    },
    setDarkMode(value: boolean) {
      this.isDarkMode = value
    },
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
