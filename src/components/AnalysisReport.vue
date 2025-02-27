<template>
  <div class="analysis-report">
    <div class="report-header">
      <h2>数据分析报告</h2>
      <wd-icon name="close" size="20px" @click="$emit('close')" />
    </div>

    <div class="report-content">
      <div class="report-intro">
        <wd-icon name="info" color="#3B82F6" size="16px" />
        <span>本报告基于近2000期历史数据分析生成，仅供参考</span>
      </div>

      <div v-if="loading" class="loading">
        <wd-loading color="#3B82F6" />
        <span>加载中...</span>
      </div>

      <div v-else-if="error" class="error">
        <wd-icon name="warn-bold" color="#F43F5E" size="40px" />
        <p>{{ error }}</p>
        <wd-button type="primary" size="small" @click="fetchReport">重试</wd-button>
      </div>

      <div v-else-if="report" class="report-body">
        <div v-if="useMdContent" v-html="formattedMarkdown"></div>
        <div v-else>
          <!-- 频率分析 -->
          <div class="report-section">
            <div class="section-header">
              <h3 class="section-title">一、数字出现频率分析</h3>
            </div>
            <div class="section-content">
              <h4 class="subsection-title">前区号码</h4>
              <div class="frequency-table">
                <div class="table-header">
                  <div class="table-cell">号码</div>
                  <div class="table-cell">出现频率</div>
                </div>
                <div
                  v-for="item in reportData.frequencyAnalysis.frontZone"
                  :key="item.number"
                  class="table-row"
                >
                  <div class="table-cell">{{ item.number }}</div>
                  <div class="table-cell">{{ item.frequency }}</div>
                </div>
              </div>

              <h4 class="subsection-title">后区号码</h4>
              <div class="frequency-table">
                <div class="table-header">
                  <div class="table-cell">号码</div>
                  <div class="table-cell">出现频率</div>
                </div>
                <div
                  v-for="item in reportData.frequencyAnalysis.backZone"
                  :key="item.number"
                  class="table-row"
                >
                  <div class="table-cell">{{ item.number }}</div>
                  <div class="table-cell">{{ item.frequency }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 冷热号码分析 -->
          <div class="report-section">
            <div class="section-header">
              <h3 class="section-title">二、冷热号码分析</h3>
            </div>
            <div class="section-content">
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>热门号码</strong>
                  : {{ reportData.hotColdAnalysis.hotNumbers.join(', ') }}
                </span>
              </div>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>冷门号码</strong>
                  : {{ reportData.hotColdAnalysis.coldNumbers.join(', ') }}
                </span>
              </div>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>转热号码</strong>
                  : {{ reportData.hotColdAnalysis.risingNumbers.join(', ') }}
                </span>
              </div>
            </div>
          </div>

          <!-- 遗漏号分析 -->
          <div class="report-section">
            <div class="section-header">
              <h3 class="section-title">三、遗漏号分析</h3>
            </div>
            <div class="section-content">
              <h4 class="subsection-title">前区号码</h4>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>最大遗漏号码</strong>
                  : {{ reportData.missingAnalysis.frontZone.maxMissingNumber }}
                </span>
              </div>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>遗漏走势描述</strong>
                  : {{ reportData.missingAnalysis.frontZone.missingTrend }}
                </span>
              </div>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>遗漏值预警提示</strong>
                  :
                </span>
              </div>
              <div
                v-for="(warning, index) in reportData.missingAnalysis.frontZone.warnings"
                :key="index"
                class="list-item warning-item"
              >
                <span class="list-bullet">-</span>
                <span class="list-content">{{ warning }}</span>
              </div>

              <h4 class="subsection-title">后区号码</h4>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>当前遗漏状况描述</strong>
                  : {{ reportData.missingAnalysis.backZone.missingStatus }}
                </span>
              </div>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>遗漏值异常提醒</strong>
                  :
                </span>
              </div>
              <div
                v-for="(warning, index) in reportData.missingAnalysis.backZone.warnings"
                :key="index"
                class="list-item warning-item"
              >
                <span class="list-bullet">-</span>
                <span class="list-content">{{ warning }}</span>
              </div>
            </div>
          </div>

          <!-- 走势特征分析 -->
          <div class="report-section">
            <div class="section-header">
              <h3 class="section-title">四、走势特征分析</h3>
            </div>
            <div class="section-content">
              <h4 class="subsection-title">前区号码</h4>
              <div
                v-for="(feature, index) in reportData.trendAnalysis.frontZoneFeatures"
                :key="index"
                class="list-item"
              >
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>走势特征</strong>
                  : {{ feature }}
                </span>
              </div>
              <div
                v-for="(point, index) in reportData.trendAnalysis.keyTurningPoints"
                :key="'point-' + index"
                class="list-item"
              >
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>关键走势拐点</strong>
                  : {{ point }}
                </span>
              </div>

              <h4 class="subsection-title">后区号码</h4>
              <div
                v-for="(feature, index) in reportData.trendAnalysis.backZoneFeatures"
                :key="'back-' + index"
                class="list-item"
              >
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>走势特征</strong>
                  : {{ feature }}
                </span>
              </div>
            </div>
          </div>

          <!-- 奇偶比分析 -->
          <div class="report-section">
            <div class="section-header">
              <h3 class="section-title">五、奇偶比分析</h3>
            </div>
            <div class="section-content">
              <h4 class="subsection-title">前区号码</h4>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>奇偶比描述</strong>
                  : {{ reportData.oddEvenAnalysis.frontZoneRatio }}
                </span>
              </div>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>推荐的奇偶比</strong>
                  : {{ reportData.oddEvenAnalysis.recommendedRatio }}
                </span>
              </div>

              <h4 class="subsection-title">后区号码</h4>
              <div class="list-item">
                <span class="list-bullet">•</span>
                <span class="list-content">
                  <strong>奇偶比描述</strong>
                  : {{ reportData.oddEvenAnalysis.backZoneRatio }}
                </span>
              </div>
            </div>
          </div>

          <!-- 推荐号码组合 -->
          <div class="report-section">
            <div class="section-header">
              <h3 class="section-title">六、推荐号码组合</h3>
            </div>
            <div class="section-content">
              <div
                v-for="(rec, index) in reportData.recommendations"
                :key="index"
                class="list-item"
              >
                <span class="list-number">{{ index + 1 }}.</span>
                <span class="list-content">
                  前区: {{ rec.frontZone.join(', ') }} | 后区: {{ rec.backZone.join(', ') }}
                </span>
              </div>
            </div>
          </div>

          <!-- 风险提示 -->
          <div class="report-section">
            <div class="section-header">
              <h3 class="section-title">七、风险提示</h3>
            </div>
            <div class="section-content">
              <div
                v-for="(warning, index) in reportData.riskWarnings"
                :key="index"
                class="list-item"
              >
                <span class="list-number">{{ index + 1 }}.</span>
                <span class="list-content">{{ warning }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLotteryStore } from '@/store/lottery'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const loading = ref(false)
const error = ref('')
const report = ref(null)
const useMdContent = ref(false) // 是否使用markdown内容
const lotteryStore = useLotteryStore()

// 获取结构化的报告数据
const reportData = computed(() => {
  if (!report.value || !report.value.analysis || !report.value.analysis.structured) {
    return null
  }
  return report.value.analysis.structured
})

// 格式化Markdown内容
const formattedMarkdown = computed(() => {
  if (!report.value || !report.value.analysis || !report.value.analysis.markdown) {
    return ''
  }

  let content = report.value.analysis.markdown || ''

  // 移除顶部的标题，因为我们已经有了自己的标题
  content = content.replace(/^# 彩票数据分析报告\n\n/, '')

  // 处理标题
  content = content.replace(
    /## (.*)/g,
    '<div class="report-section"><div class="section-header"><h3 class="section-title">$1</h3></div><div class="section-content">',
  )
  content = content.replace(/### (.*)/g, '<h4 class="subsection-title">$1</h4>')

  // 处理表格
  content = content.replace(
    /\| (.*) \| (.*) \|\n\|------\|----------\|/g,
    '<div class="frequency-table"><div class="table-header"><div class="table-cell">$1</div><div class="table-cell">$2</div></div>',
  )
  content = content.replace(
    /\| (\d+) +\| (\d+) +\|/g,
    '<div class="table-row"><div class="table-cell">$1</div><div class="table-cell">$2</div></div>',
  )
  // 关闭表格
  content = content.replace(/(<div class="table-row">.*?<\/div>)\n\n/g, '$1</div>\n\n')

  // 处理有序列表
  content = content.replace(
    /(\d+)\. (.*)/g,
    '<div class="list-item"><span class="list-number">$1.</span><span class="list-content">$2</span></div>',
  )

  // 处理无序列表
  content = content.replace(
    /- (.*)/g,
    '<div class="list-item"><span class="list-bullet">•</span><span class="list-content">$1</span></div>',
  )

  // 处理粗体
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 处理段落
  content = content.replace(/\n\n/g, '</p><p>')
  content = '<p>' + content + '</p>'
  content = content.replace(/<p><div/g, '<div').replace(/<\/div><\/p>/g, '</div>')
  content = content.replace(/<p><h3/g, '<h3').replace(/<\/h3><\/p>/g, '</h3>')
  content = content.replace(/<p><h4/g, '<h4').replace(/<\/h4><\/p>/g, '</h4>')

  // 关闭章节容器
  const sections = content.split('<div class="report-section">')
  for (let i = 1; i < sections.length; i++) {
    if (i < sections.length - 1) {
      sections[i] = sections[i].replace(
        /<div class="report-section">/,
        '</div></div><div class="report-section">',
      )
    }
  }
  content = sections.join('<div class="report-section">') + '</div></div>'

  return content
})

// 获取报告数据
const fetchReport = async () => {
  loading.value = true
  error.value = ''

  try {
    // 获取当前彩票类型
    const lotteryType = lotteryStore.currentLotteryType
    console.log('Current lottery type:', lotteryType)

    // 构建API端点
    const baseUrl = import.meta.env.VITE_SERVER_BASEURL || ''
    const analyzeEndpoint = `${baseUrl}/api/analyze/${lotteryType}`

    console.log('Fetching analysis report from:', analyzeEndpoint)

    // 调用真实的API
    try {
      const res = await new Promise((resolve, reject) => {
        uni.request({
          url: analyzeEndpoint,
          method: 'GET',
          timeout: 120000, // 120秒超时
          success: resolve,
          fail: reject,
        })
      })

      console.log('API response status:', res.statusCode)
      console.log('API response data:', JSON.stringify(res.data))

      if (res.statusCode !== 200) {
        error.value = `获取报告失败: 服务器返回状态码 ${res.statusCode}`
        useMockData()
        return
      }

      if (!res.data || !res.data.success) {
        error.value = `获取报告失败: ${res.data?.message || '服务器返回数据格式不正确'}`
        useMockData()
        return
      }

      // 检查返回的数据结构
      if (!res.data.analysis || !res.data.analysis.structured) {
        console.error('API response missing structured data:', res.data)
        error.value = '获取报告失败: 服务器返回数据缺少结构化内容'
        useMockData()
        return
      }

      // 更新报告数据
      report.value = res.data
      console.log('Report data updated successfully')
      loading.value = false
    } catch (err) {
      console.error('API request error:', err)
      error.value = `获取报告失败: ${err.message || '未知错误'}`
      // 使用模拟数据
      useMockData()
    }
  } catch (err) {
    console.error('Error fetching analysis report:', err)
    error.value = `获取报告失败: ${err.message || '未知错误'}`
    // 使用模拟数据
    useMockData()
  }
}

// 使用模拟数据
const useMockData = () => {
  console.log('Using mock data')
  // 使用示例数据
  report.value = {
    success: true,
    analysis: {
      structured: {
        frequencyAnalysis: {
          frontZone: [
            { number: 21, frequency: 10 },
            { number: 1, frequency: 9 },
            { number: 10, frequency: 9 },
            { number: 11, frequency: 8 },
            { number: 12, frequency: 8 },
          ],
          backZone: [
            { number: 10, frequency: 12 },
            { number: 12, frequency: 11 },
            { number: 1, frequency: 10 },
          ],
        },
        hotColdAnalysis: {
          hotNumbers: [21, 1, 10, 11, 12],
          coldNumbers: [35],
          risingNumbers: [3, 7, 8, 9],
        },
        missingAnalysis: {
          frontZone: {
            maxMissingNumber: 35,
            missingTrend: '号码35已经连续多期未出现，需密切关注。',
            warnings: ['遗漏值较高，注意补号机会。'],
          },
          backZone: {
            missingStatus: '后区号码3连续多期未出现，值得关注。',
            warnings: ['遗漏值异常，需关注补号机会。'],
          },
        },
        trendAnalysis: {
          frontZoneFeatures: ['前区号码以小数居多，大数较少。'],
          backZoneFeatures: ['后区号码集中在中等大小范围。'],
          keyTurningPoints: ['号码35出现次数显著减少，可能进入冷态。'],
        },
        oddEvenAnalysis: {
          frontZoneRatio: '前区号码奇偶比为2:3。',
          backZoneRatio: '后区号码奇偶比为1:1。',
          recommendedRatio: '推荐奇偶比为2:3',
        },
        recommendations: [
          {
            frontZone: [1, 2, 10, 11, 12],
            backZone: [10, 12],
          },
          {
            frontZone: [1, 7, 10, 11, 12],
            backZone: [1, 10],
          },
          {
            frontZone: [1, 3, 10, 11, 12],
            backZone: [10, 12],
          },
        ],
        riskWarnings: [
          '彩票有风险，投注需谨慎，理性购彩。',
          '本分析仅供参考，不作为购彩依据。',
          '历史走势不代表未来趋势。',
        ],
      },
      markdown:
        '# 彩票数据分析报告\n\n## 一、数字出现频率分析\n### 前区号码\n| 号码 | 出现频率 |\n|------|----------|\n| 21   | 10       |\n| 1    | 9        |\n| 10   | 9        |\n| 11   | 8        |\n| 12   | 8        |\n\n### 后区号码\n| 号码 | 出现频率 |\n|------|----------|\n| 10   | 12       |\n| 12   | 11       |\n| 1   | 10       |\n\n## 二、冷热号码分析\n- **热门号码**: 21, 1, 10, 11, 12\n- **冷门号码**: 35\n- **转热号码**: 3, 7, 8, 9\n\n## 三、遗漏号分析\n### 前区号码\n- **最大遗漏号码**: 35\n- **遗漏走势描述**: 号码35已经连续多期未出现，需密切关注。\n- **遗漏值预警提示**:\n  - 遗漏值较高，注意补号机会。\n\n### 后区号码\n- **当前遗漏状况描述**: 后区号码3连续多期未出现，值得关注。\n- **遗漏值异常提醒**:\n  - 遗漏值异常，需关注补号机会。\n\n## 四、走势特征分析\n### 前区号码\n- **走势特征**: 前区号码以小数居多，大数较少。\n- **关键走势拐点**: 号码35出现次数显著减少，可能进入冷态。\n\n### 后区号码\n- **走势特征**: 后区号码集中在中等大小范围。\n\n## 五、奇偶比分析\n### 前区号码\n- **奇偶比描述**: 前区号码奇偶比为2:3。\n- **推荐的奇偶比**: 推荐奇偶比为2:3\n\n### 后区号码\n- **奇偶比描述**: 后区号码奇偶比为1:1。\n\n## 六、推荐号码组合\n1. 前区: 1, 2, 10, 11, 12 | 后区: 10, 12\n2. 前区: 1, 7, 10, 11, 12 | 后区: 1, 10\n3. 前区: 1, 3, 10, 11, 12 | 后区: 10, 12\n\n## 七、风险提示\n1. 彩票有风险，投注需谨慎，理性购彩。\n2. 本分析仅供参考，不作为购彩依据。\n3. 历史走势不代表未来趋势。',
    },
  }
  loading.value = false
}

onMounted(() => {
  if (props.visible) {
    fetchReport()
  }
})
</script>

<style scoped>
.analysis-report {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f8fafc;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  color: white;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.report-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: white;
}

.report-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
}

.report-intro {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.report-intro span {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.report-body {
  padding-bottom: 32px;
  line-height: 1.6;
}

.report-section {
  margin: 0 0 16px;
  overflow: hidden;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  padding: 12px 16px;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e40af;
}

.section-content {
  padding: 16px;
}

.subsection-title {
  padding-left: 8px;
  margin: 16px 0 12px;
  font-size: 15px;
  font-weight: 500;
  color: #3b82f6;
  border-left: 3px solid #3b82f6;
}

.list-item {
  display: flex;
  padding-left: 8px;
  margin-bottom: 8px;
}

.warning-item {
  padding-left: 24px;
}

.list-number,
.list-bullet {
  flex: 0 0 20px;
  font-weight: 600;
  color: #3b82f6;
}

.list-content {
  flex: 1;
}

.frequency-table {
  width: 100%;
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-header {
  display: flex;
  background-color: #f1f5f9;
  font-weight: 600;
}

.table-row {
  display: flex;
  border-top: 1px solid #e2e8f0;
}

.table-cell {
  flex: 1;
  padding: 8px 12px;
  text-align: center;
}

p {
  margin: 8px 0;
}

strong {
  font-weight: 500;
  color: #3b82f6;
}
</style>
