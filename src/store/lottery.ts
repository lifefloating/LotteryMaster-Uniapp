import { defineStore } from 'pinia'

export interface LotteryPrediction {
  primaryNumbers: (number | string)[]
  specialNumbers: (number | string)[]
}

export interface LotteryData {
  lotteryType: string
  period: string
  date: string
  predictions: LotteryPrediction[]
}

export const useLotteryStore = defineStore('lottery', {
  state: () => ({
    currentLotteryType: 'ssq', // 'ssq' for 双色球, 'dlt' for 大乐透
    lotteryData: {
      ssq: {
        period: '2025021',
        date: '2025-02-26',
        predictions: [
          {
            primaryNumbers: [3, 11, 16, 22, 28, 33],
            specialNumbers: [14],
          },
          {
            primaryNumbers: [5, 12, 18, 25, 30, 35],
            specialNumbers: [7],
          },
          {
            primaryNumbers: [8, 13, 19, 24, 29, 34],
            specialNumbers: [11],
          },
          {
            primaryNumbers: [2, 10, 17, 23, 31, 32],
            specialNumbers: [9],
          },
          {
            primaryNumbers: [6, 15, 20, 26, 27, 36],
            specialNumbers: [4],
          },
          {
            primaryNumbers: [1, 9, 14, 21, 32, 35],
            specialNumbers: [16],
          },
        ],
      },
      dlt: {
        period: '2025021',
        date: '2025-02-26',
        predictions: [
          {
            primaryNumbers: [2, 8, 15, 22, 31],
            specialNumbers: [5, 12],
          },
          {
            primaryNumbers: [3, 9, 17, 25, 33],
            specialNumbers: [6, 10],
          },
          {
            primaryNumbers: [5, 11, 19, 27, 34],
            specialNumbers: [3, 8],
          },
          {
            primaryNumbers: [7, 13, 21, 29, 35],
            specialNumbers: [2, 9],
          },
          {
            primaryNumbers: [1, 10, 18, 26, 32],
            specialNumbers: [4, 11],
          },
          {
            primaryNumbers: [4, 12, 20, 28, 30],
            specialNumbers: [1, 7],
          },
        ],
      },
    } as Record<
      string,
      {
        period: string
        date: string
        predictions: LotteryPrediction[]
      }
    >,
    isLoading: false,
    error: null as string | null,
  }),
  getters: {
    getCurrentLotteryData(): {
      period: string
      date: string
      predictions: LotteryPrediction[]
    } {
      return this.lotteryData[this.currentLotteryType]
    },
  },
  actions: {
    setLotteryType(type: string) {
      this.currentLotteryType = type
    },
    async fetchLotteryData() {
      this.isLoading = true
      this.error = null

      try {
        // First call the scraping API
        const scrapeEndpoint =
          this.currentLotteryType === 'ssq' ? '/api/scrape/ssq' : '/api/scrape/dlt'

        console.log('Calling scrape endpoint:', scrapeEndpoint)

        try {
          // 使用Promise方式，但避开类型检查问题
          const scrapeRes = (await new Promise((resolve) => {
            uni.request({
              url: scrapeEndpoint,
              method: 'GET',
              success: resolve,
              fail: resolve,
            })
          })) as any
          console.log('Scrape API response:', scrapeRes.statusCode)
        } catch (scrapeErr) {
          console.error('Error calling scrape API:', scrapeErr)
          // 继续执行，不中断流程
        }

        // Then call the prediction API
        const analyzeEndpoint =
          this.currentLotteryType === 'ssq' ? '/api/analyze/ssq' : '/api/analyze/dlt'

        console.log('Calling analyze endpoint:', analyzeEndpoint)

        try {
          // 使用Promise方式，但避开类型检查问题
          const analyzeRes = (await new Promise((resolve, reject) => {
            uni.request({
              url: analyzeEndpoint,
              method: 'GET',
              timeout: 120000, // 120秒超时
              success: resolve,
              fail: reject,
            })
          })) as any

          if (analyzeRes.statusCode !== 200) {
            console.error('Analyze API returned non-200 status:', analyzeRes.statusCode)
            this.error = `获取数据失败，服务器返回状态码 ${analyzeRes.statusCode}`
          } else {
            console.log('Analyze API response successful')
          }
        } catch (analyzeErr) {
          console.error('Error calling analyze API:', analyzeErr)
          this.error = '获取数据失败，请稍后重试'
        }

        this.isLoading = false
      } catch (error) {
        this.error = '获取数据失败，请稍后重试'
        this.isLoading = false
        console.error('Error fetching lottery data:', error)
      }
    },
  },
  persist: {
    key: 'lottery-storage',
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
