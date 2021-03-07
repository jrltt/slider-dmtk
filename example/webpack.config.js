const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv').config();

const env = process.env.NODE_ENV;

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'app'),
    port: 3500,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [env == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        SECRETS: JSON.stringify(dotenv.parsed),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyPlugin({
      patterns: [{ from: './app/assets', to: 'assets/' }],
    }),
  ],
};
