// 分析报告的模拟数据
export const MOCK_ANALYSIS_REPORT = {
  success: true,
  analysis: {
    structured: {
      frequencyAnalysis: {
        frontZone: [
          { number: 1, frequency: 43 },
          { number: 2, frequency: 40 },
          { number: 3, frequency: 39 },
          { number: 4, frequency: 37 },
          { number: 5, frequency: 37 },
        ],
        backZone: [
          { number: 1, frequency: 40 },
          { number: 2, frequency: 35 },
          { number: 3, frequency: 33 },
        ],
      },
      hotColdAnalysis: {
        hotNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        coldNumbers: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        risingNumbers: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      },
      missingAnalysis: {
        frontZone: {
          maxMissingNumber: 29,
          missingTrend: '前区号码29已经连续10期没有出现，需重点关注。',
          warnings: ['号码29已达到最大遗漏值，可能近期会回补。'],
        },
        backZone: {
          missingStatus: '后区号码3已经连续5期没有出现，但其遗漏值仍在正常范围内。',
          warnings: ['号码3的遗漏值逐渐增加，可能需要留意。'],
        },
      },
      trendAnalysis: {
        frontZoneFeatures: ['前区号码出现以小号为主的趋势', '号码1和2出现频率较高'],
        backZoneFeatures: ['后区号码1和2出现频率较高'],
        keyTurningPoints: ['号码29的遗漏值持续增长，可能会在未来几期内回补。'],
      },
      oddEvenAnalysis: {
        frontZoneRatio: '前区号码奇偶比为3:2，较为均衡。',
        backZoneRatio: '后区号码奇偶比为1:1，较为均衡。',
        recommendedRatio: '推荐的奇偶比为3:2',
      },
      recommendations: [
        {
          frontZone: [1, 2, 3, 4, 5],
          backZone: [1, 2],
        },
        {
          frontZone: [6, 7, 8, 9, 10],
          backZone: [3, 4],
        },
        {
          frontZone: [11, 12, 13, 14, 15],
          backZone: [5, 6],
        },
      ],
      riskWarnings: [
        '彩票有风险，投注需谨慎，理性购彩。',
        '本分析仅供参考，不作为投资建议。',
        '注意控制投注金额，避免造成不必要的损失。',
      ],
    },
  },
}
