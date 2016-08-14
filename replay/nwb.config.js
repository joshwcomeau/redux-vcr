module.exports = {
  type: 'react-component',
  build: {
    externals: {
      'react': 'React'
    },
    global: 'ReduxVCR_replay',
    jsNext: true,
    umd: true
  }
}
