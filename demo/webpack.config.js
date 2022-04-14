
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')


module.exports = {
    context: path.resolve(__dirname, './'),
    entry: {
      'icons': path.resolve(__dirname, './index.tsx'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/',
        libraryTarget: 'umd',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src/')
      }
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
              },
            ]
          },
          {
            test: /\.less$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
            ]
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'sass-loader',
              },
            ]
          },
          {
            test: /\.(png|jpg|ttf)$/,
            use: [
              {
                loader: 'url-loader',
              }
            ]
          },
        ]
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        hot: true,
        port: 8080,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'react svg images',
          inject: 'body',
          scriptLoading: 'blocking',
          publicPath: '',
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}