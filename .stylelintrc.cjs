// .stylelintrc.cjs

module.exports = {
  root: true,
  extends: [
    // stylelint-config-standard 替换成了更宽松的 stylelint-config-recommended
    'stylelint-config-recommended',
    // stylelint-config-standard-scss 替换成了更宽松的 stylelint-config-recommended-scss
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order',
  ],
  plugins: ['stylelint-prettier'],
  overrides: [
    // 扫描 .vue/html 文件中的<style>标签内的样式
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.{css,scss}'],
      customSyntax: 'postcss-scss',
    },
  ],
  // 自定义规则
  rules: {
    'prettier/prettier': true,
    // 允许 global 、export 、v-deep等伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'v-deep', 'deep'],
      },
    ],
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['rpx'],
      },
    ],
    // 处理小程序page标签和uni-app特有标签不认识的问题
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: [
          'page',
          'uni-app',
          'uni-page',
          'uni-page-wrapper',
          'uni-page-body',
          'uni-page-head',
          'uni-button',
          'uni-image',
          'uni-input',
          'uni-scroll-view',
          'uni-swiper',
          'uni-switch',
          'uni-text',
          'uni-view',
          'uni-toast',
          'uni-tabbar',
          'uni-resize-sensor',
          'uni-cover-view',
        ],
      },
    ],
    'comment-empty-line-before': 'never', // never|always|always-multi-line|never-multi-line
    'custom-property-empty-line-before': 'never',
    'no-empty-source': null,
    'comment-no-empty': null,
    'no-duplicate-selectors': null,
    'scss/comment-no-empty': null,
    'selector-class-pattern': null,
    'font-family-no-missing-generic-family-keyword': null,
    // 关闭选择器顺序规则，避免与 wot-design-uni 组件库冲突
    'no-descending-specificity': null,
    // 关闭 SCSS 操作符换行规则
    'scss/operator-no-newline-after': null,
  },
}
