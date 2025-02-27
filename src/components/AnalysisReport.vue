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
            <div v-for="(rec, index) in reportData.recommendations" :key="index" class="list-item">
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
            <div v-for="(warning, index) in reportData.riskWarnings" :key="index" class="list-item">
              <span class="list-number">{{ index + 1 }}.</span>
              <span class="list-content">{{ warning }}</span>
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
import { MOCK_ANALYSIS_REPORT } from '@/constants/mockData'

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
  if (!report.value?.analysis?.structured) {
    return null
  }
  return report.value.analysis.structured
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
      if (!res.data.analysis?.structured) {
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

// 使用模拟数据（仅在开发环境使用）
const useMockData = () => {
  if (import.meta.env.MODE !== 'development') {
    console.warn('Mock data should only be used in development mode')
    return
  }

  console.log('Using mock data')
  loading.value = true
  error.value = ''

  try {
    report.value = MOCK_ANALYSIS_REPORT
  } catch (err) {
    console.error('Error setting mock data:', err)
    error.value = '设置模拟数据失败'
  } finally {
    loading.value = false
  }
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
