module.exports = {
  type: 'web-module',
  build: {
    externals: {},
    global: 'ReduxVCR/capture',
    jsNext: true,
    umd: true,
  }
}
