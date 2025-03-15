# 彩票大师 (Lottery Master)

彩票大师是一款现代化的彩票分析应用，支持双色球和大乐透两种彩票类型的数据分析和预测。应用提供了直观的用户界面，包括历史趋势分析和与中奖号码的比较功能。

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flifefloating%2FLotteryMaster-Uniapp)

## 项目演示

在线演示地址：[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://lottery-master.vercel.app/#/)

## 功能特点

- 支持双色球和大乐透两种彩票类型
- 智能预测号码功能
- 历史走势分析
- 数据报告分析
- 冷热号分析

## 技术栈

- uniapp + Vue3 + TypeScript
- Vite 构建工具
- Pinia 状态管理
- SCSS 样式处理
- UnoCss 原子化 CSS
- Wot Design Uni UI 组件库

## 项目结构

```
.
├── src                   # 源代码目录
│   ├── components        # 组件目录
│   │   ├── AnalysisReport.vue     # 分析报告组件
│   │   ├── BottomNavBar.vue       # 底部导航栏组件
│   │   ├── LotteryDataCards.vue   # 数据卡片组件
│   │   ├── LotteryHeatmapBoard.vue # 热力图组件
│   │   ├── LotteryNumberBall.vue  # 号码球组件
│   │   ├── LotteryPredictionSet.vue # 预测号码组件
│   │   ├── LotteryTypeSwitch.vue  # 彩票类型切换组件
│   │   └── QiunDataCharts.vue     # 数据图表组件
│   ├── constants         # 常量目录
│   │   └── mockData.ts   # 模拟数据
│   ├── pages             # 页面目录
│   │   ├── index/        # 预测主页
│   │   ├── profile/      # 个人中心页面
│   │   └── trends/       # 走势分析页面
│   ├── static            # 静态资源
│   ├── store             # 状态管理
│   │   ├── lottery.ts    # 彩票数据状态
│   │   └── user.ts       # 用户状态
│   ├── styles            # 全局样式
│   └── utils             # 工具函数
│       ├── request.ts    # 网络请求封装
│       └── timeUtils.ts  # 时间工具函数
├── public               # 公共资源目录
└── vite.config.ts      # Vite配置文件
```

## API 集成点

- 双色球数据抓取: `/api/scrape/ssq`
- 大乐透数据抓取: `/api/scrape/dlt`
- 双色球预测分析: `/api/analyze/ssq`
- 大乐透预测分析: `/api/analyze/dlt`
- 双色球趋势图数据: `/api/trends/ssq`
- 大乐透趋势图数据: `/api/trends/dlt`
- 双色球频率(热力图)数据: `/api/frequency/ssq`
- 大乐透频率(热力图)数据: `/api/frequency/dlt`

## 安装与运行

1. 安装依赖

```bash
pnpm install
```

2. 开发模式运行

```bash
# H5
pnpm dev:h5

# 微信小程序
pnpm dev:mp-weixin

# App
pnpm dev:app
```

3. 构建

```bash
# H5
pnpm build:h5

# 微信小程序
pnpm build:mp-weixin

# App
pnpm build:app
```

## TODO
- 下拉刷新 下拉后才调用预测接口
- loading
- fc3d 增加新类型

## 设计规范

应用遵循现代化的设计规范，包括：

- 亮色/暗色主题支持
- 圆形号码球设计
- 卡片式布局
- 响应式设计，适配不同尺寸的设备

## 贡献指南

欢迎提交 Issue 或 Pull Request 来改进这个项目。

## 致谢

感谢 [unibest](https://github.com/codercup/unibest) 提供的优秀模版，确实很好用！

## 许可证

MIT
