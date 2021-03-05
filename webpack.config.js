const path = require('path');

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
      ],
    },
    resolve: {
      extensions: ['.js', '.json'],
    },
  };
};
