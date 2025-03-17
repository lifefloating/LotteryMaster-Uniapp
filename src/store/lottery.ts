import { defineStore } from 'pinia'
import { MOCK_ANALYSIS_REPORT } from '@/constants/mockData'

export type LotteryType = 'ssq' | 'dlt' | 'fc3d'

export interface LotteryPrediction {
  primaryNumbers: number[]
  specialNumbers: number[]
}

export interface LotteryData {
  period: string
  date: string
  predictions: LotteryPrediction[]
  topRecommendation?: LotteryPrediction
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
      fc3d: null,
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

            if (this.currentLotteryType === 'fc3d') {
              // 处理福彩3D数据
              const analysis = analyzeRes.data.analysis?.structured

              if (analysis) {
                // 从频率分析中获取热门号码
                const hundredsPlace = analysis.frequencyAnalysis?.hundredsPlace || []
                const tensPlace = analysis.frequencyAnalysis?.tensPlace || []
                const onesPlace = analysis.frequencyAnalysis?.onesPlace || []

                // 从热冷分析中获取热门号码
                const hotHundreds = analysis.hotColdAnalysis?.hundredsPlace?.hotNumbers || []
                const hotTens = analysis.hotColdAnalysis?.tensPlace?.hotNumbers || []
                const hotOnes = analysis.hotColdAnalysis?.onesPlace?.hotNumbers || []

                // 获取推荐号码
                const recommendations = analysis.recommendations || []
                const topRecommendation = analysis.topRecommendation || null

                // 构建预测数据
                const predictions = []

                // 添加直选推荐
                if (recommendations.length > 0) {
                  for (const rec of recommendations) {
                    if (rec.numbers && rec.numbers.length === 3) {
                      predictions.push({
                        primaryNumbers: rec.numbers,
                        specialNumbers: [],
                      })
                    }
                  }
                }

                // 如果没有足够的推荐，添加热门号码组合
                if (
                  predictions.length < 5 &&
                  hotHundreds.length > 0 &&
                  hotTens.length > 0 &&
                  hotOnes.length > 0
                ) {
                  for (let i = 0; i < Math.min(3, hotHundreds.length); i++) {
                    for (let j = 0; j < Math.min(3, hotTens.length); j++) {
                      for (let k = 0; k < Math.min(3, hotOnes.length); k++) {
                        if (predictions.length < 5) {
                          const combination = [hotHundreds[i], hotTens[j], hotOnes[k]]
                          // 检查是否已存在
                          const exists = predictions.some(
                            (p) =>
                              p.primaryNumbers.length === 3 &&
                              p.primaryNumbers[0] === combination[0] &&
                              p.primaryNumbers[1] === combination[1] &&
                              p.primaryNumbers[2] === combination[2],
                          )

                          if (!exists) {
                            predictions.push({
                              primaryNumbers: combination,
                              specialNumbers: [],
                            })
                          }
                        }
                      }
                    }
                  }
                }

                // 确保有顶部推荐
                let effectiveTopRecommendation = null
                if (topRecommendation && topRecommendation.directSelection) {
                  effectiveTopRecommendation = {
                    primaryNumbers: topRecommendation.directSelection,
                    specialNumbers: [],
                  }
                } else if (predictions.length > 0) {
                  effectiveTopRecommendation = predictions[0]
                }

                // 更新彩票数据
                this.lotteryData[this.currentLotteryType] = {
                  period: analyzeRes.data.period || this.getCurrentPeriod(),
                  date: analyzeRes.data.date || this.getCurrentDate(),
                  predictions,
                  topRecommendation: effectiveTopRecommendation,
                }

                console.log('Updated FC3D predictions:', this.lotteryData[this.currentLotteryType])
              } else {
                console.warn('FC3D API response missing structured analysis, using mock data')
                this.useMockData()
              }
            } else {
              // 处理双色球和大乐透数据
              const recommendations = analyzeRes.data.analysis?.structured?.recommendations
              const topRecommendation = analyzeRes.data.analysis?.structured?.topRecommendation

              console.log('API response structured topRecommendation:', topRecommendation)

              // 确保总是有一个顶部推荐，如果API没有返回，则使用第一个推荐
              const effectiveTopRecommendation =
                topRecommendation ||
                (recommendations && recommendations.length > 0 ? recommendations[0] : null)

              if (recommendations && Array.isArray(recommendations)) {
                // 更新对应彩票类型的数据
                this.lotteryData[this.currentLotteryType] = {
                  period: analyzeRes.data.period || this.getCurrentPeriod(),
                  date: analyzeRes.data.date || this.getCurrentDate(),
                  predictions: recommendations.map((rec: any) => ({
                    primaryNumbers: rec.frontZone || [],
                    specialNumbers: rec.backZone || [],
                  })),
                  topRecommendation: effectiveTopRecommendation
                    ? {
                        primaryNumbers: effectiveTopRecommendation.frontZone || [],
                        specialNumbers: effectiveTopRecommendation.backZone || [],
                      }
                    : undefined,
                }

                console.log(
                  'Updated predictions with recommendations:',
                  this.lotteryData[this.currentLotteryType],
                )
              } else {
                console.warn('API response missing recommendations array, using mock data')
                this.useMockData()
              }
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

      if (this.currentLotteryType === 'fc3d') {
        // 福彩3D模拟数据
        const mockPredictions = [
          { primaryNumbers: [9, 8, 6], specialNumbers: [] },
          { primaryNumbers: [5, 7, 8], specialNumbers: [] },
          { primaryNumbers: [7, 6, 4], specialNumbers: [] },
          { primaryNumbers: [9, 7, 7], specialNumbers: [] },
          { primaryNumbers: [8, 8, 7], specialNumbers: [] },
        ]

        this.lotteryData[this.currentLotteryType] = {
          period: this.getCurrentPeriod(),
          date: this.getCurrentDate(),
          predictions: mockPredictions,
          topRecommendation: mockPredictions[0],
        }
      } else {
        // 双色球和大乐透模拟数据
        const mockRecommendations = MOCK_ANALYSIS_REPORT.analysis.structured.recommendations

        this.lotteryData[this.currentLotteryType] = {
          period: this.getCurrentPeriod(),
          date: this.getCurrentDate(),
          predictions: mockRecommendations.map((rec) => ({
            primaryNumbers: rec.frontZone,
            specialNumbers: rec.backZone,
          })),
          topRecommendation: {
            primaryNumbers: mockRecommendations[0].frontZone,
            specialNumbers: mockRecommendations[0].backZone,
          },
        }
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
