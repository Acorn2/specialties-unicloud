module.exports = {
    content: ['./pages/**/*.vue', './components/**/*.vue'],
    corePlugins: {
      preflight: false, // 避免与uni-app默认样式冲突
    },
    theme: {
      extend: {
        colors: {
          primary: '#D83931',
        },
      },
    },
    variants: {},
    plugins: [],
  }