// uno.config.ts
import {
  type Preset,
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { presetApplet, presetRemRpx, transformerAttributify } from 'unocss-applet'

// @see https://unocss.dev/presets/legacy-compat
// import { presetLegacyCompat } from '@unocss/preset-legacy-compat'

const isMp = process.env?.UNI_PLATFORM?.startsWith('mp') ?? false

const presets: Preset[] = []
if (isMp) {
  // 使用小程序预设
  presets.push(presetApplet(), presetRemRpx())
} else {
  presets.push(
    // 非小程序用官方预设
    presetUno(),
    // 支持css class属性化
    presetAttributify(),
  )
}
export default defineConfig({
  presets: [
    ...presets,
    // 图标最后选的 flat-color-icons
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        width: '1.2em',
        height: '1.2em',
      },
    }),
    // 将颜色函数 (rgb()和hsl()) 从空格分隔转换为逗号分隔，更好的兼容性app端，example：
    // `rgb(255 0 0)` -> `rgb(255, 0, 0)`
    // `rgba(255 0 0 / 0.5)` -> `rgba(255, 0, 0, 0.5)`
    // 与群友的正常写法冲突，先去掉！（2024-05-25）
    // presetLegacyCompat({
    //   commaStyleColorFunction: true,
    // }) as Preset,
  ],
  // 添加响应式断点配置，与UI设计规范保持一致
  theme: {
    breakpoints: {
      'sm': '320px',   // 移动设备最小宽度
      'md': '481px',   // 平板设备最小宽度
      'lg': '769px',   // 桌面设备最小宽度
    },
  },
  /**
   * 自定义快捷语句
   * @see https://github.com/unocss/unocss#shortcuts
   */
  shortcuts: [
    ['center', 'flex justify-center items-center'],
    // Responsive layout shortcuts
    ['container', 'w-full mx-auto px-4'],
    ['row', 'flex flex-wrap -mx-2'],
    ['col', 'px-2'],
    // Responsive display shortcuts
    ['hide-sm', 'sm:hidden'],
    ['hide-md', 'md:hidden lg:block'],
    ['hide-lg', 'lg:hidden'],
    ['show-sm', 'block md:hidden lg:hidden'],
    ['show-md', 'hidden md:block lg:hidden'],
    ['show-lg', 'hidden lg:block'],
    // Safe area utilities
    ['safe-top', 'pt-safe'],
    ['safe-bottom', 'pb-safe'],
    ['safe-inset', 'p-safe'],
    // Responsive flex utilities
    ['flex-col-row', 'flex flex-col md:flex-row'],
    ['flex-row-col', 'flex flex-row md:flex-col'],
  ],
  transformers: [
    // 启用 @apply 功能
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
    // Don't change the following order
    transformerAttributify({
      // 解决与第三方框架样式冲突问题
      prefixedOnly: true,
      prefix: 'fg',
    }),
  ],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
})

/**
 * 最终这一套组合下来会得到：
 * mp 里面：mt-4 => margin-top: 32rpx  == 16px
 * h5 里面：mt-4 => margin-top: 1rem == 16px
 *
 * 如果是传统方式写样式，则推荐设计稿设置为 750，这样设计稿1px，代码写1rpx。
 * rpx是响应式的，可以让不同设备的屏幕显示效果保持一致。
 */
