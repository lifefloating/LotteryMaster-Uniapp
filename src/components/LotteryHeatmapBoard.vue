<template>
  <view class="lottery-heatmap-board">
    <view class="board-header">
      <view class="display-toggle">
        <view 
          class="toggle-option" 
          :class="{ active: displayValue === 'frequency' }"
          @click="displayValue = 'frequency'"
        >
          <text class="option-text">出现频率</text>
        </view>
        <view 
          class="toggle-option" 
          :class="{ active: displayValue === 'interval' }"
          @click="displayValue = 'interval'"
        >
          <text class="option-text">当前间隔</text>
        </view>
      </view>
    </view>
    
    <view class="board-grid" :class="{ 'blue-grid': zoneType === 'blue', 'red-grid': zoneType === 'red' }">
      <view
        v-for="stat in numberStats"
        :key="stat.number"
        class="grid-item"
        :class="{
          'blue-item': zoneType === 'blue',
          'red-item': zoneType === 'red',
          'selected': selectedNumbers.includes(stat.number)
        }"
        :style="getCellStyle(stat)"
        @click="toggleNumberSelection(stat.number)"
      >
        <text class="number">{{ stat.number }}</text>
        <text class="value">{{ displayValue === 'interval' ? stat.currentInterval : stat.frequency }}</text>
      </view>
    </view>
    
    <view v-if="selectedNumbers.length > 0" class="selected-details">
      <view class="details-header">
        <text class="details-title">所选号码详情</text>
        <view class="clear-button" @click="clearSelection">
          <text class="clear-text">清除</text>
        </view>
      </view>
      <view class="details-content">
        <view 
          v-for="number in selectedNumbers" 
          :key="number" 
          class="detail-item"
          :class="{ 'detail-blue': zoneType === 'blue', 'detail-red': zoneType === 'red' }"
        >
          <text class="detail-number">{{ number }}</text>
          <view class="detail-stats">
            <view class="stat-item">
              <text class="stat-label">出现频率:</text>
              <text class="stat-value">{{ getStatByNumber(number).frequency }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">当前间隔:</text>
              <text class="stat-value">{{ getStatByNumber(number).currentInterval }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">平均间隔:</text>
              <text class="stat-value">{{ getStatByNumber(number).averageInterval.toFixed(1) }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">最大间隔:</text>
              <text class="stat-value">{{ getStatByNumber(number).maxInterval }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">概率:</text>
              <text class="stat-value">{{ (getStatByNumber(number).probability * 100).toFixed(1) }}%</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'

defineOptions({
  name: 'LotteryHeatmapBoard',
})

// 定义属性
const props = defineProps<{
  lotteryType: string,
  zoneType: string,
  periodCount: number
}>()

// 内部状态
const numberStats = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const displayValue = ref('frequency') // 'frequency' or 'interval'
const selectedNumbers = ref<number[]>([])

// 获取号码统计数据
const fetchNumberStats = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const url = `http://127.0.0.1:3008/api/chart/trend?type=${props.lotteryType}&zoneType=${props.zoneType}&periodCount=${props.periodCount}&includeChartData=false`
    const response = await uni.request({
      url,
      method: 'GET'
    })
    
    // @ts-ignore
    const result = response.data
    
    if (result.success && result.data.statistics) {
      numberStats.value = result.data.statistics.numberStats
    } else {
      error.value = '获取数据失败'
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

// 获取单个号码的统计数据
const getStatByNumber = (number: number) => {
  return numberStats.value.find((stat) => stat.number === number) || {
    frequency: 0,
    currentInterval: 0,
    averageInterval: 0,
    maxInterval: 0,
    probability: 0
  }
}

// 计算单元格样式
const getCellStyle = (stat: any) => {
  // 根据显示类型决定颜色深浅
  let intensity = 0
  
  if (displayValue.value === 'frequency') {
    // 找出最高频率用作标准化
    const maxFreq = Math.max(...numberStats.value.map(s => s.frequency))
    intensity = maxFreq > 0 ? stat.frequency / maxFreq : 0
  } else {
    // 间隔越大，颜色越浅（反向）
    const maxInterval = Math.max(...numberStats.value.map(s => s.currentInterval))
    intensity = maxInterval > 0 ? 1 - (stat.currentInterval / maxInterval) : 0
  }
  
  // 根据球种类型选择颜色
  const baseColor = props.zoneType === 'blue' ? '66, 133, 244' : '255, 82, 82'
  
  // 计算颜色深浅（0.1-0.9范围，确保有基本颜色）
  const alpha = 0.1 + (intensity * 0.8)
  
  return {
    backgroundColor: `rgba(${baseColor}, ${alpha})`,
  }
}

// 切换号码选择
const toggleNumberSelection = (number: number) => {
  const index = selectedNumbers.value.indexOf(number)
  if (index >= 0) {
    selectedNumbers.value.splice(index, 1)
  } else {
    selectedNumbers.value.push(number)
  }
}

// 清除选择
const clearSelection = () => {
  selectedNumbers.value = []
}
</script>

<style lang="scss" scoped>
.lottery-heatmap-board {
  width: 100%;
  box-sizing: border-box;
  padding: 0 16px 16px;
  overflow-x: hidden; // 防止内容溢出

  .board-header {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .display-toggle {
      display: flex;
      background-color: #f0f0f0;
      border-radius: 20px;
      overflow: hidden;

      .toggle-option {
        padding: 6px 12px;
        font-size: 14px;
        color: #666;

        &.active {
          background-color: #333;
          color: #fff;
        }
      }
    }
  }

  .board-grid {
    display: grid;
    width: 100%;
    gap: 8px;
    justify-content: center;
    
    // 确保网格容器不会超出视口宽度
    max-width: 100%;
    
    &.blue-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      
      @media (max-width: 340px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    &.red-grid {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      
      @media (max-width: 400px) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      
      @media (max-width: 340px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1/1;
      border-radius: 8px;
      padding: 8px 4px;
      box-sizing: border-box;
      text-align: center;
      min-width: 0; // 确保子元素可以缩小

      &.blue-item {
        background-color: rgba(66, 133, 244, 0.1);
        border: 1px solid rgba(66, 133, 244, 0.2);
      }

      &.red-item {
        background-color: rgba(255, 82, 82, 0.1);
        border: 1px solid rgba(255, 82, 82, 0.2);
      }

      &.selected {
        box-shadow: 0 0 0 2px #333;
        transform: scale(1.05);
        z-index: 1;
      }

      &.blue-item.selected {
        box-shadow: 0 0 0 2px #4285f4;
      }

      &.red-item.selected {
        box-shadow: 0 0 0 2px #ff5252;
      }

      .number {
        font-size: 18px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
        
        @media (max-width: 400px) {
          font-size: 16px;
        }
      }

      .value {
        font-size: 14px;
        color: #666;
        
        @media (max-width: 400px) {
          font-size: 12px;
        }
      }
    }
  }
  
  .selected-details {
    margin-top: 16px;
    padding: 16px;
    border-radius: 8px;
    background-color: #f9f9f9;
    
    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .details-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
      
      .clear-button {
        padding: 4px 10px;
        border-radius: 4px;
        background-color: #f1f1f1;
        
        .clear-text {
          font-size: 12px;
          color: #666;
        }
      }
    }
    
    .details-content {
      .detail-item {
        display: flex;
        align-items: flex-start;
        padding: 12px;
        margin-bottom: 12px;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        
        &.detail-blue {
          border-left: 4px solid #4285f4;
        }
        
        &.detail-red {
          border-left: 4px solid #ff5252;
        }
        
        .detail-number {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          margin-right: 12px;
          background-color: #4285f4;
        }
        
        &.detail-blue .detail-number {
          background-color: #4285f4;
        }
        
        &.detail-red .detail-number {
          background-color: #ff5252;
        }
        
        .detail-stats {
          flex: 1;
          
          .stat-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            
            .stat-label {
              font-size: 12px;
              color: #666;
            }
            
            .stat-value {
              font-size: 12px;
              font-weight: 500;
              color: #333;
            }
          }
        }
      }
    }
  }
}
</style>
