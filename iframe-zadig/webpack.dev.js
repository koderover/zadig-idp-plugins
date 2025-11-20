const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 8080,
    host: 'localhost',
    hot: true,
    open: true,
    historyApiFallback: true,
    static: {
      directory: './public'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
})
