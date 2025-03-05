<template>
  <view class="lottery-data-cards">
    <view class="cards-container">
      <!-- 热门号码卡片 -->
      <view 
        class="data-card hot-numbers-card" 
        :class="{ 'blue-theme': zoneType === 'blue', 'red-theme': zoneType === 'red' }"
      >
        <view class="card-header">
          <text class="card-title">热门号码</text>
        </view>
        <view class="card-content">
          <view class="hot-numbers-list">
            <view 
              v-for="(number, index) in hotNumbers" 
              :key="index"
              class="hot-number-item"
            >
              <view 
                class="number-badge"
                :class="{ 'blue-badge': zoneType === 'blue', 'red-badge': zoneType === 'red' }"
              >
                {{ number.number }}
              </view>
              <view class="number-stats">
                <text class="stats-label">频率: {{ number.frequency }}</text>
                <view class="frequency-bar-container">
                  <view 
                    class="frequency-bar"
                    :class="{ 'blue-bar': zoneType === 'blue', 'red-bar': zoneType === 'red' }"
                    :style="{ width: getFrequencyPercentage(number.frequency) + '%' }"
                  ></view>
                </view>
                <text class="stats-label">概率: {{ (number.probability * 100).toFixed(1) }}%</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 冷门号码卡片 -->
      <view 
        class="data-card cold-numbers-card" 
        :class="{ 'blue-theme': zoneType === 'blue', 'red-theme': zoneType === 'red' }"
      >
        <view class="card-header">
          <text class="card-title">冷门号码</text>
        </view>
        <view class="card-content">
          <view class="cold-numbers-list">
            <view 
              v-for="(number, index) in coldNumbers" 
              :key="index"
              class="cold-number-item"
            >
              <view 
                class="number-badge"
                :class="{ 'blue-badge': zoneType === 'blue', 'red-badge': zoneType === 'red' }"
              >
                {{ number.number }}
              </view>
              <view class="number-stats">
                <text class="stats-label">当前间隔: {{ number.currentInterval }}期</text>
                <view class="interval-bar-container">
                  <view 
                    class="interval-bar"
                    :class="{ 'blue-bar': zoneType === 'blue', 'red-bar': zoneType === 'red' }"
                    :style="{ width: getIntervalPercentage(number.currentInterval) + '%' }"
                  ></view>
                </view>
                <text class="stats-label">上次出现: {{ number.lastInterval }}期前</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 间隔分析卡片 -->
      <view 
        class="data-card interval-analysis-card" 
        :class="{ 'blue-theme': zoneType === 'blue', 'red-theme': zoneType === 'red' }"
      >
        <view class="card-header">
          <text class="card-title">间隔分析</text>
        </view>
        <view class="card-content">
          <view class="interval-stats">
            <view class="interval-summary">
              <view class="stat-item">
                <text class="stat-value">{{ averageMaxInterval.toFixed(1) }}</text>
                <text class="stat-label">平均最大间隔</text>
              </view>
              <view class="stat-item">
                <text class="stat-value">{{ averageInterval.toFixed(1) }}</text>
                <text class="stat-label">平均间隔</text>
              </view>
              <view class="stat-item">
                <text class="stat-value">{{ maxIntervalNumber }}</text>
                <text class="stat-label">最大间隔号码</text>
              </view>
              <view class="stat-item">
                <text class="stat-value">{{ maxIntervalValue }}</text>
                <text class="stat-label">最大间隔值</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 概率分布卡片 -->
      <view 
        class="data-card probability-card" 
        :class="{ 'blue-theme': zoneType === 'blue', 'red-theme': zoneType === 'red' }"
      >
        <view class="card-header">
          <text class="card-title">概率分布</text>
        </view>
        <view class="card-content">
          <view class="probability-visualization">
            <view 
              v-for="(bar, index) in probabilityBars" 
              :key="index"
              class="probability-bar-wrapper"
            >
              <view 
                class="probability-bar"
                :class="{ 'blue-bar': zoneType === 'blue', 'red-bar': zoneType === 'red' }"
                :style="{ height: bar.height + '%' }"
              ></view>
              <text class="probability-number">{{ bar.number }}</text>
            </view>
          </view>
          <view class="probability-legend">
            <text class="legend-text">数字越高表示历史概率越大</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'

defineOptions({
  name: 'LotteryDataCards',
})

// 定义属性
const props = defineProps<{
  lotteryType: string,
  zoneType: string,
  periodCount: number
}>()

// 内部状态
const numberStats = ref<any[]>([])
const frequencyData = ref<any>({ datasets: [] })
const loading = ref(false)
const error = ref('')

// 获取号码统计数据
const fetchNumberStats = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 获取趋势数据
    const trendUrl = `http://127.0.0.1:3008/api/chart/trend?type=${props.lotteryType}&zoneType=${props.zoneType}&periodCount=${props.periodCount}&includeChartData=false`
    const trendResponse = await uni.request({
      url: trendUrl,
      method: 'GET'
    })
    
    // @ts-ignore
    const trendResult = trendResponse.data
    
    if (trendResult.success && trendResult.data.statistics) {
      numberStats.value = trendResult.data.statistics.numberStats
    } else {
      error.value = '获取趋势数据失败'
    }
    
    // 获取频率数据
    const frequencyUrl = `http://127.0.0.1:3008/api/chart/frequency?type=${props.lotteryType}&zoneType=${props.zoneType}&periodCount=${props.periodCount}`
    const frequencyResponse = await uni.request({
      url: frequencyUrl,
      method: 'GET'
    })
    
    // @ts-ignore
    const frequencyResult = frequencyResponse.data
    
    if (frequencyResult.success && frequencyResult.data) {
      frequencyData.value = frequencyResult.data
    } else {
      error.value = '获取频率数据失败'
    }
  } catch (e) {
    error.value = '请求出错'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 观察属性变化，重新获取数据
watch([() => props.lotteryType, () => props.zoneType, () => props.periodCount], () => {
  fetchNumberStats()
})

// 组件挂载时获取数据
onMounted(() => {
  fetchNumberStats()
})

// 计算热门号码 (频率最高的5个)
const hotNumbers = computed(() => {
  if (!numberStats.value.length) return []
  
  return [...numberStats.value]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5)
    .filter(item => item.frequency > 0)
})

// 计算冷门号码 (当前间隔最大的5个)
const coldNumbers = computed(() => {
  if (!numberStats.value.length) return []
  
  return [...numberStats.value]
    .sort((a, b) => b.currentInterval - a.currentInterval)
    .slice(0, 5)
    .filter(item => item.currentInterval > 0)
})

// 计算平均间隔
const averageInterval = computed(() => {
  if (!numberStats.value.length) return 0
  
  const validStats = numberStats.value.filter(s => s.averageInterval > 0)
  if (!validStats.length) return 0
  
  return validStats.reduce((sum, s) => sum + s.averageInterval, 0) / validStats.length
})

// 计算平均最大间隔
const averageMaxInterval = computed(() => {
  if (!numberStats.value.length) return 0
  
  const validStats = numberStats.value.filter(s => s.maxInterval > 0)
  if (!validStats.length) return 0
  
  return validStats.reduce((sum, s) => sum + s.maxInterval, 0) / validStats.length
})

// 获取最大间隔号码
const maxIntervalNumber = computed(() => {
  if (!numberStats.value.length) return 0
  
  const maxIntervalStat = numberStats.value.reduce(
    (max, stat) => stat.maxInterval > max.maxInterval ? stat : max, 
    { maxInterval: 0, number: 0 }
  )
  
  return maxIntervalStat.number
})

// 获取最大间隔值
const maxIntervalValue = computed(() => {
  if (!numberStats.value.length) return 0
  
  const maxIntervalStat = numberStats.value.reduce(
    (max, stat) => stat.maxInterval > max.maxInterval ? stat : max, 
    { maxInterval: 0 }
  )
  
  return maxIntervalStat.maxInterval
})

// 概率柱状图数据
const probabilityBars = computed(() => {
  if (!numberStats.value.length) return []
  
  // 按概率排序，取前10个
  const topProbabilities = [...numberStats.value]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 10)
  
  // 最大概率值
  const maxProb = Math.max(...topProbabilities.map(s => s.probability))
  
  // 为每个号码计算相对高度 (20%-100%)
  return topProbabilities.map(stat => ({
    number: stat.number,
    probability: stat.probability,
    height: maxProb > 0 ? 20 + ((stat.probability / maxProb) * 80) : 0
  }))
})

// 计算频率百分比 (用于显示条形图)
const getFrequencyPercentage = (frequency: number) => {
  if (!hotNumbers.value.length) return 0
  
  const maxFreq = Math.max(...hotNumbers.value.map(n => n.frequency))
  return maxFreq > 0 ? (frequency / maxFreq) * 100 : 0
}

// 计算间隔百分比 (用于显示条形图)
const getIntervalPercentage = (interval: number) => {
  if (!coldNumbers.value.length) return 0
  
  const maxInterval = Math.max(...coldNumbers.value.map(n => n.currentInterval))
  return maxInterval > 0 ? (interval / maxInterval) * 100 : 0
}
</script>

<style lang="scss" scoped>
.lottery-data-cards {
  width: 100%;
  padding: 16px;
  background-color: #ffffff;
  
  .cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: space-between;
  }
  
  .data-card {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    margin-bottom: 16px;
    
    // 响应式卡片宽度
    @media screen and (min-width: 480px) {
      width: calc(50% - 8px);  // 一行两个，考虑间距
    }
    
    @media screen and (min-width: 768px) {
      width: calc(50% - 8px);  // 平板上也是一行两个
    }
    
    @media screen and (min-width: 1024px) {
      width: calc(25% - 12px);  // 电脑上一行四个
    }
    
    &.blue-theme {
      .card-header {
        background-color: #4285f4;
      }
    }
    
    &.red-theme {
      .card-header {
        background-color: #ff5252;
      }
    }
    
    .card-header {
      padding: 12px 16px;
      
      .card-title {
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
      }
    }
    
    .card-content {
      padding: 16px;
      
      // 热门号码卡片内容
      .hot-numbers-list {
        .hot-number-item {
          display: flex;
          margin-bottom: 12px;
          align-items: center;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .number-badge {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 36px;
            border-radius: 18px;
            font-weight: 500;
            font-size: 14px;
            color: #ffffff;
            margin-right: 12px;
            flex-shrink: 0;
            
            &.blue-badge {
              background-color: #4285f4;
            }
            
            &.red-badge {
              background-color: #ff5252;
            }
          }
          
          .number-stats {
            flex: 1;
            
            .stats-label {
              font-size: 12px;
              color: #666;
              display: block;
              margin-bottom: 4px;
            }
            
            .frequency-bar-container {
              width: 100%;
              height: 4px;
              background-color: #f0f0f0;
              border-radius: 2px;
              margin: 4px 0 8px;
              overflow: hidden;
              
              .frequency-bar {
                height: 100%;
                border-radius: 2px;
                
                &.blue-bar {
                  background-color: #4285f4;
                }
                
                &.red-bar {
                  background-color: #ff5252;
                }
              }
            }
          }
        }
      }
      
      // 冷门号码卡片内容
      .cold-numbers-list {
        .cold-number-item {
          display: flex;
          margin-bottom: 12px;
          align-items: center;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .number-badge {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 36px;
            border-radius: 18px;
            font-weight: 500;
            font-size: 14px;
            color: #ffffff;
            margin-right: 12px;
            flex-shrink: 0;
            
            &.blue-badge {
              background-color: #4285f4;
            }
            
            &.red-badge {
              background-color: #ff5252;
            }
          }
          
          .number-stats {
            flex: 1;
            
            .stats-label {
              font-size: 12px;
              color: #666;
              display: block;
              margin-bottom: 4px;
            }
            
            .interval-bar-container {
              width: 100%;
              height: 4px;
              background-color: #f0f0f0;
              border-radius: 2px;
              margin: 4px 0 8px;
              overflow: hidden;
              
              .interval-bar {
                height: 100%;
                border-radius: 2px;
                
                &.blue-bar {
                  background-color: #4285f4;
                }
                
                &.red-bar {
                  background-color: #ff5252;
                }
              }
            }
          }
        }
      }
      
      // 间隔分析卡片内容
      .interval-stats {
        .interval-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          
          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 12px;
            background-color: #f9f9f9;
            border-radius: 8px;
            
            .stat-value {
              font-size: 20px;
              font-weight: 600;
              color: #333;
              margin-bottom: 4px;
            }
            
            .stat-label {
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          }
        }
      }
      
      // 概率分布卡片内容
      .probability-visualization {
        display: flex;
        height: 150px;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .probability-bar-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 8%;
          
          .probability-bar {
            width: 100%;
            min-height: 4px;
            border-radius: 2px 2px 0 0;
            
            &.blue-bar {
              background-color: #4285f4;
            }
            
            &.red-bar {
              background-color: #ff5252;
            }
          }
          
          .probability-number {
            font-size: 10px;
            color: #666;
            margin-top: 4px;
          }
        }
      }
      
      .probability-legend {
        text-align: center;
        margin-top: 8px;
        
        .legend-text {
          font-size: 10px;
          color: #999;
        }
      }
    }
  }
}
</style>
