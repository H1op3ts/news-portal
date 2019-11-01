const path = require('path');
//const $ = require('jQuery');
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  mode: 'development',
  entry: {
      app:'./public/src/index.js'
    },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.pug$/i,
        use: ["html-loader", "pug-html-loader"],
      },
    ],
  },
  plugins: [
    
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: './public/src/index.pug'
    }),
  ],
  watch: true
  
   
};