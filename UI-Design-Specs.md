# 彩票大师 (Lottery Master) UI 设计规范

## 设计概览

彩票大师是一款现代化的彩票分析应用，支持双色球和大乐透两种彩票类型的数据分析和预测。应用提供了直观的用户界面，包括历史趋势分析和与中奖号码的比较功能。

## 颜色方案

### 亮色主题

| 颜色名称     | 颜色值  | 预览                                                                                                                       |
| ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| 主背景色     | #FFFFFF | <span style="display: inline-block; width: 20px; height: 20px; background-color: #FFFFFF; border: 1px solid #000;"></span> |
| 次要背景色   | #F5F7FA | <span style="display: inline-block; width: 20px; height: 20px; background-color: #F5F7FA; border: 1px solid #000;"></span> |
| 主要文本色   | #333333 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #333333; border: 1px solid #000;"></span> |
| 次要文本色   | #666666 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #666666; border: 1px solid #000;"></span> |
| 强调色       | #3B82F6 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #3B82F6; border: 1px solid #000;"></span> |
| 双色球主色   | #3B82F6 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #3B82F6; border: 1px solid #000;"></span> |
| 大乐透主色   | #10B981 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #10B981; border: 1px solid #000;"></span> |
| 特殊号码背景 | #F3F4F6 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #F3F4F6; border: 1px solid #000;"></span> |

### 暗色主题

| 颜色名称     | 颜色值  | 预览                                                                                                                       |
| ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| 主背景色     | #1F2937 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #1F2937; border: 1px solid #000;"></span> |
| 次要背景色   | #111827 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #111827; border: 1px solid #000;"></span> |
| 主要文本色   | #F9FAFB | <span style="display: inline-block; width: 20px; height: 20px; background-color: #F9FAFB; border: 1px solid #000;"></span> |
| 次要文本色   | #D1D5DB | <span style="display: inline-block; width: 20px; height: 20px; background-color: #D1D5DB; border: 1px solid #000;"></span> |
| 强调色       | #60A5FA | <span style="display: inline-block; width: 20px; height: 20px; background-color: #60A5FA; border: 1px solid #000;"></span> |
| 双色球主色   | #60A5FA | <span style="display: inline-block; width: 20px; height: 20px; background-color: #60A5FA; border: 1px solid #000;"></span> |
| 大乐透主色   | #34D399 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #34D399; border: 1px solid #000;"></span> |
| 特殊号码背景 | #374151 | <span style="display: inline-block; width: 20px; height: 20px; background-color: #374151; border: 1px solid #000;"></span> |

## 排版

- 主标题: 18px, 粗体
- 副标题: 16px, 中等
- 正文: 14px, 常规
- 小文本: 12px, 常规
- 号码球: 16px, 粗体

## 组件设计

### 顶部导航栏

- 高度: 56px
- 左侧: 返回按钮 (< 图标)
- 中间: 当前功能名称 (粗体)
- 右侧: 历史记录按钮 (时钟图标)
- 底部阴影: 轻微阴影效果

### 彩票类型切换

- 设计: 分段控制器
- 高度: 48px
- 圆角: 8px
- 选中状态: 背景色为对应彩票主色，文字为白色
- 未选中状态: 背景色为透明，文字为次要文本色

### 号码球设计

- 直径: 40px
- 圆形设计
- 主要号码: 蓝色背景 (#3B82F6)，白色文字
- 特殊号码: 灰色背景 (#F3F4F6)，深色文字
- 阴影: 轻微阴影效果

### 预测结果区域

- 背景: 白色卡片
- 圆角: 12px
- 内边距: 16px
- 分隔线: 1px 浅灰色线条
- 组号标识: 左侧小标签

### 底部导航栏

- 高度: 64px
- 三个主要功能按钮均匀分布
- 图标上方显示文字
- 选中状态: 主色调
- 未选中状态: 灰色

## 页面设计

### 1. 首页 (预测页面)

#### 布局结构

- 顶部导航栏
- 彩票类型切换
- 购买日期和期号信息
- 预测号码展示区
- 多组预测号码列表
- 底部导航栏

#### 交互逻辑

- 切换彩票类型时自动更新对应数据
- 点击历史按钮进入历史记录页面
- 底部导航可切换到其他主要功能页面

### 2. 走势分析页面

#### 布局结构

- 顶部导航栏
- 彩票类型切换
- 时间范围选择器
- 走势图表展示区域
- 数据统计信息
- 底部导航栏

#### 图表类型

- 号码出现频率图
- 号码遗漏值图
- 号码走势图
- 冷热号分析

### 3. 个人页面

#### 布局结构

- 顶部导航栏
- 用户信息区域
- 设置选项列表
- 主题切换开关
- 应用信息
- 底部导航栏

## API 集成点

### 数据抓取 API

- 双色球: `/api/scrape/ssq`
- 大乐透: `/api/scrape/dlt`

### 预测结果 API

- 双色球: `/api/analyze/ssq`
- 大乐透: `/api/analyze/dlt`

### 处理流程

1. 首先调用抓取 API 获取最新数据
2. 然后调用预测 API 获取分析结果
3. 将结果渲染到 UI 界面

## 响应式设计

应用应适配不同尺寸的设备：

- 移动设备: 320px - 480px
- 平板设备: 481px - 768px
- 桌面设备: 769px 以上

## 加载状态

- 数据加载中显示骨架屏或加载动画
- 加载失败时显示友好的错误提示和重试按钮

## 动画效果

- 页面切换: 平滑过渡效果
- 彩票类型切换: 滑动过渡效果
- 号码球: 轻微弹跳效果
- 按钮点击: 轻微缩放效果
