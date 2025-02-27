<template>
  <div class="analysis-report">
    <div class="report-header">
      <h2>彩票数据分析报告</h2>
      <wd-icon name="close" size="20px" @click="$emit('close')" />
    </div>

    <div class="report-content">
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
        <div v-html="formattedReport"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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

// 格式化报告内容，将Markdown转换为HTML
const formattedReport = computed(() => {
  if (!report.value) return ''

  // 这里简单处理一下Markdown格式
  // 实际项目中可以使用专门的Markdown解析库
  let content = report.value.analysis || ''

  // 处理标题
  content = content.replace(/### (.*)/g, '<h3>$1</h3>')
  content = content.replace(/#### (.*)/g, '<h4>$1</h4>')

  // 处理列表
  content = content.replace(/- (.*)/g, '<li>$1</li>')
  content = content.replace(/<li>/g, '<ul><li>').replace(/<\/li>/g, '</li></ul>')
  content = content.replace(/<\/ul><ul>/g, '')

  // 处理粗体
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 处理换行
  content = content.replace(/\n/g, '<br>')

  return content
})

// 获取报告数据
const fetchReport = async () => {
  loading.value = true
  error.value = ''

  try {
    // 模拟API请求，实际项目中应该调用真实的API
    // const response = await fetch('/api/analysis-report')
    // const data = await response.json()

    // 使用示例数据
    setTimeout(() => {
      report.value = {
        success: true,
        analysis:
          '## 彩票数据分析报告\n\n### 一、数字出现频率分析\n\n#### 前区号码\n1. **最高频号码**\n   - 1 (出现次数：18次)\n   - 3 (出现次数：16次)\n   - 7 (出现次数：15次)\n   - 11 (出现次数：15次)\n   - 2 (出现次数：14次)\n\n2. **最低频号码**\n   - 35 (出现次数：11次)\n   - 29 (出现次数：11次)\n   - 34 (出现次数：10次)\n   - 33 (出现次数：10次)\n   - 32 (出现次数：10次)\n\n#### 后区号码\n1. **最高频号码**\n   - 1 (出现次数：16次)\n   - 10 (出现次数：15次)\n   - 12 (出现次数：15次)\n   - 2 (出现次数：13次)\n   - 7 (出现次数：13次)\n\n2. **最低频号码**\n   - 4 (出现次数：9次)\n   - 5 (出现次数：10次)\n   - 6 (出现次数：11次)\n   - 8 (出现次数：11次)\n   - 9 (出现次数：11次)\n\n### 二、冷热号码分析\n\n#### 最近10期热门号码\n- 前区：1, 3, 7, 11, 2\n- 后区：1, 10, 12, 2, 7\n\n#### 长期未出现的冷门号码\n- 前区：35, 29, 34, 33, 32\n- 后区：4, 5, 6, 8, 9\n\n#### 值得关注的转热号码\n- 前区：1, 3, 7, 11, 2\n- 后区：1, 10, 12, 2, 7\n\n### 三、遗漏号分析\n\n#### 前区遗漏值分析\n1. **当前最大遗漏号码**\n   - 35 (遗漏值：4)\n   - 29 (遗漏值：4)\n   - 34 (遗漏值：4)\n   - 33 (遗漏值：4)\n   - 32 (遗漏值：4)\n\n2. **近期遗漏走势**\n   - 多数号码的遗漏值在1-3之间波动。\n\n3. **遗漏值预警提示**\n   - 35, 29, 34, 33, 32 都已连续遗漏4期，值得关注。\n\n#### 后区遗漏值分析\n1. **当前遗漏状况**\n   - 4 (遗漏值：3)\n   - 5 (遗漏值：3)\n   - 6 (遗漏值：3)\n   - 8 (遗漏值：3)\n   - 9 (遗漏值：3)\n\n2. **遗漏值异常提醒**\n   - 后区号码4, 5, 6, 8, 9 都已连续遗漏3期，需要特别留意。\n\n### 四、走势特征分析\n\n#### 号码走势特点\n1. **前区走势特征**\n   - 多数号码集中在1-11之间，尤其是1, 3, 7, 11等号码频繁出现。\n   - 连号出现较少，斜连号较为常见。\n\n2. **后区走势特征**\n   - 后区号码1, 10, 12, 2, 7出现频率较高。\n   - 连号和斜连号出现较多。\n\n3. **关键走势拐点**\n   - 从最近几期数据来看，1, 3, 7, 11, 2等号码出现频繁，可能是一个拐点。\n\n#### 走势图重要指标\n1. **号码分布特征**\n   - 前区号码多集中在1-11之间，后区号码多集中在1, 10, 12, 2, 7之间。\n   \n2. **连号走势分析**\n   - 连号出现较少，但斜连号较多。\n\n3. **斜连号分析**\n   - 斜连号如1, 2, 3, 7, 11等号码频繁出现。\n\n### 五、中奖注数分析\n\n#### 历史中奖分布\n1. **各奖级中奖注数统计**\n   - 各奖项中奖注数波动较大，但总体呈上升趋势。\n\n2. **中奖注数走势**\n   - 中奖注数在最近几期有所增加。\n\n3. **奖池金额变化**\n   - 奖池金额保持稳定，但中奖注数增加可能会影响奖池金额的变化。\n\n#### 中奖号码特征\n1. **热门中奖组合**\n   - 组合如1, 3, 7, 11, 2等出现频繁。\n\n2. **罕见中奖组合**\n   - 罕见中奖组合较少，但建议关注冷门号码的出现。\n\n### 六、奇偶比分析\n\n#### 前区奇偶比\n1. **近期奇偶分布**\n   - 奇数号码出现频率较高，如1, 3, 7, 9, 11等。\n\n2. **奇偶比例趋势**\n   - 前区奇数号码明显多于偶数号码。\n\n3. **最优奇偶组合**\n   - 建议选择3奇2偶或2奇3偶的组合。\n\n#### 后区奇偶特征\n1. **奇偶出现规律**\n   - 后区号码1, 10, 12, 2, 7中，奇数号码略多。\n\n2. **奇偶搭配建议**\n   - 建议选择1奇1偶的组合。\n\n### 七、号码组合特征\n\n#### 常见的连号组合\n- 1, 2; 2, 3; 7, 11等\n\n#### 前后区号码关联性\n- 前区号码1, 3, 7, 11, 2与后区号码1, 10, 12, 2, 7有较高的关联性。\n\n#### 特殊组合模式\n- 1, 3, 7, 11, 2 + 1, 10, 12, 2, 7\n\n### 八、下期参考建议\n\n#### 推荐号码组合\n1. **组合1**\n   - 前区：1, 3, 7, 11, 2\n   - 后区：1, 10, 12\n\n2. **组合2**\n   - 前区：1, 3, 7, 11, 2\n   - 后区：2, 7\n\n3. **组合3**\n   - 前区：1, 3, 7, 11, 2\n   - 后区：1, 12\n\n#### 参考投注策略\n- 重点关注高频率出现的号码。\n- 尝试选择一些冷门号码，以增加中奖机会。\n- 选择3奇2偶或2奇3偶的组合。\n\n#### 重点关注号码\n- 前区：1, 3, 7, 11, 2\n- 后区：1, 10, 12, 2, 7\n\n### 九、风险提示\n\n#### 预测准确度评估\n- 由于彩票的随机性和不可预测性，本报告仅作为参考，不保证一定中奖。\n\n#### 投注建议\n- 投注时应根据自身经济情况合理安排资金，切勿过度投入。\n\n#### 理性购彩提醒\n- 购买彩票应以娱乐为主，理性消费，不要沉迷其中。',
      }
      loading.value = false
    }, 1000)
  } catch (err) {
    error.value = '获取报告失败，请稍后重试'
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
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  background-color: #3b82f6;
  color: white;
}

.report-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: white;
}

.report-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.loading,
.error {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.report-body {
  line-height: 1.6;
}

.report-body h3 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 500;
  color: #3b82f6;
  border-left: 4px solid #3b82f6;
  padding-left: 10px;
}

.report-body h4 {
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #4b5563;
}

.report-body ul {
  margin: 8px 0;
  padding-left: 20px;
}

.report-body li {
  margin-bottom: 8px;
  position: relative;
}

.report-body li::before {
  content: '•';
  color: #3b82f6;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.report-body strong {
  font-weight: 500;
  color: #3b82f6;
}
</style>
