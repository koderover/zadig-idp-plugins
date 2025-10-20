const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'plugin.js',
    library: 'GitLabMRPlugin',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin()
  ],
  externals: {
    vue: 'Vue',
    'element-ui': 'ELEMENT',
    'zadig-plugin-sdk': 'ZadigPluginSDK'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  optimization: {
    minimize: true,
    minimizer: [
      new (require('terser-webpack-plugin'))({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false, 
          },
        },
      }),
    ],
  }
}
