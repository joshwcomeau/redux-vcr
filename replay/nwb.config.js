var path = require('path');

module.exports = {
  type: 'react-component',
  build: {
    externals: {
      'react': 'React'
    },
    global: 'ReduxVCR_replay',
    jsNext: true,
    umd: true
  },
  webpack: {
    extra: {
      resolve: {
        alias: {
          '_icons': path.join(__dirname, 'src/icons')
        }
      }
    }
  }
}
