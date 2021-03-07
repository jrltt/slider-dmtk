const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const env = process.env.NODE_ENV;

module.exports = () => {
  return {
    context: __dirname,
    entry: './src/main.js',
    output: {
      filename: 'main.js',
      libraryTarget: 'umd',
      path: path.join(__dirname, 'dist'),
      library: '[name]',
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [env == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'slider-dmtk.css',
        chunkFilename: '[id].css',
      }),
    ],
    resolve: {
      extensions: ['.js', '.json'],
    },
  };
};
