const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: [
    path.join(__dirname, 'src/docs'), path.join(__dirname, 'src/style')
  ],
  output: {
    path: path.join(__dirname, 'docs'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/docs/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    alias: {
      'react-customizable-section-field': path.join(__dirname, 'src/lib')
    }
  },
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    port: 8000,
    stats: 'minimal'
  }
};