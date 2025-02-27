import { defineStore } from 'pinia'
import { MOCK_ANALYSIS_REPORT } from '@/constants/mockData'

export type LotteryType = 'ssq' | 'dlt'

export interface LotteryPrediction {
  primaryNumbers: number[]
  specialNumbers: number[]
}

export interface LotteryData {
  period: string
  date: string
  predictions: LotteryPrediction[]
}

interface LotteryState {
  currentLotteryType: LotteryType
  lotteryData: Record<LotteryType, LotteryData | null>
  isLoading: boolean
  error: string | null
}

export const useLotteryStore = defineStore('lottery', {
  state: (): LotteryState => ({
    currentLotteryType: 'ssq',
    lotteryData: {
      ssq: null,
      dlt: null,
    },
    isLoading: false,
    error: null,
  }),

  getters: {
    getCurrentLotteryData(): LotteryData | null {
      return this.lotteryData[this.currentLotteryType]
    },
  },

  actions: {
    setLotteryType(type: LotteryType) {
      this.currentLotteryType = type
      // 如果当前类型的数据为空，则获取数据
      if (!this.lotteryData[type]) {
        this.fetchLotteryData()
      }
    },

    async fetchLotteryData() {
      this.isLoading = true
      this.error = null

      try {
        // First call the scraping API
        const scrapeEndpoint = `/api/scrape/${this.currentLotteryType}`
        console.log('Calling scrape endpoint:', scrapeEndpoint)

        try {
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
        const analyzeEndpoint = `/api/analyze/${this.currentLotteryType}`
        console.log('Calling analyze endpoint:', analyzeEndpoint)

        try {
          const analyzeRes = (await new Promise((resolve, reject) => {
            uni.request({
              url: analyzeEndpoint,
              method: 'GET',
              timeout: 120000, // 120秒超时
              success: resolve,
              fail: reject,
            })
          })) as any

          if (analyzeRes.statusCode === 200 && analyzeRes.data?.success) {
            console.log('Analyze API response successful')

            const recommendations = analyzeRes.data.analysis?.structured?.recommendations
            if (recommendations && Array.isArray(recommendations)) {
              // 更新对应彩票类型的数据
              this.lotteryData[this.currentLotteryType] = {
                period: analyzeRes.data.period || this.getCurrentPeriod(),
                date: analyzeRes.data.date || this.getCurrentDate(),
                predictions: recommendations.map((rec: any) => ({
                  primaryNumbers: rec.frontZone || [],
                  specialNumbers: rec.backZone || [],
                })),
              }

              console.log(
                'Updated predictions with recommendations:',
                this.lotteryData[this.currentLotteryType],
              )
            } else {
              console.warn('API response missing recommendations array, using mock data')
              this.useMockData()
            }
          } else {
            console.error('Analyze API returned non-200 status:', analyzeRes.statusCode)
            this.useMockData()
          }
        } catch (analyzeErr) {
          console.error('Error calling analyze API:', analyzeErr)
          this.useMockData()
        }
      } catch (err) {
        console.error('Error in fetchLotteryData:', err)
        this.useMockData()
      } finally {
        this.isLoading = false
      }
    },

    getCurrentPeriod(): string {
      const now = new Date()
      const year = now.getFullYear()
      const weekNumber = Math.ceil((now.getDate() + 6) / 7)
      return `${year}${String(weekNumber).padStart(3, '0')}`
    },

    getCurrentDate(): string {
      const now = new Date()
      return now.toISOString().split('T')[0]
    },

    // 使用模拟数据
    useMockData() {
      console.log('Using mock data for', this.currentLotteryType)

      const mockRecommendations = MOCK_ANALYSIS_REPORT.analysis.structured.recommendations

      this.lotteryData[this.currentLotteryType] = {
        period: this.getCurrentPeriod(),
        date: this.getCurrentDate(),
        predictions: mockRecommendations.map((rec) => ({
          primaryNumbers: rec.frontZone,
          specialNumbers: rec.backZone,
        })),
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
