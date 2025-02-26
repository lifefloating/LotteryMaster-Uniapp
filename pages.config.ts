import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [
    {
      // 预测页面（首页）
      path: 'pages/index/index',
      style: {
        navigationBarTitleText: '彩票大师',
      },
      type: 'page',
    },
    {
      // 走势分析页面
      path: 'pages/trends/index',
      style: {
        navigationBarTitleText: '走势分析',
      },
      type: 'page',
    },
    {
      // 个人页面
      path: 'pages/my/index',
      style: {
        navigationBarTitleText: '我的',
      },
      type: 'page',
    },
    // 历史记录页面
    {
      path: 'pages-sub/history/index',
      style: {
        navigationBarTitleText: '历史记录',
      },
      type: 'page',
    },
  ],
  // 全局样式
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '彩票大师',
    navigationBarBackgroundColor: '#FFFFFF',
    backgroundColor: '#F5F7FA',
  },
  // easycom 规则
  easycom: {
    autoscan: true,
    custom: {
      '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
    },
  },
  // tabBar 配置
  tabBar: {
    color: '#666666',
    selectedColor: '#3B82F6',
    borderStyle: 'black',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'static/icons/predict.png',
        selectedIconPath: 'static/icons/predict-active.png',
        text: '预测',
      },
      {
        pagePath: 'pages/trends/index',
        iconPath: 'static/icons/trends.png',
        selectedIconPath: 'static/icons/trends-active.png',
        text: '走势',
      },
      {
        pagePath: 'pages/my/index',
        iconPath: 'static/icons/my.png',
        selectedIconPath: 'static/icons/my-active.png',
        text: '我的',
      },
    ],
  },
})
