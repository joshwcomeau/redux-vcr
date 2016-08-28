module.exports = {
  type: 'web-module',
  build: {
    externals: {},
    global: 'ReduxVCR_capture',
    jsNext: true,
    umd: true,
  }
}
