var path = require('path');
var bower_dir = __dirname + '/bower_components';
var webpack = require('webpack');

var config = {
  addVendor: function (name, path, f) {
    this.resolve.alias[name] = path;
  },
  entry: __dirname + '/app/main.js',
  resolve: { alias: {} },
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  module: {
    noParse: [
       bower_dir + '/react/react.min.js'
    ],
    loaders: [
    {
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/,
      query: {
        presets: [ 'es2015', 'react']
      }
    },
    {
      test: /\.scss$/,
      loader: 'style!css!sass'
    },
    {
      test: /\.css$/,
      loader: 'style!css'
    },
    {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'url-loader?prefix=font/&limit=1000000000&name=[name].[ext]'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
       $: "jquery",
       jQuery: "jquery"
   })
]
};

config.addVendor('jquery', bower_dir + '/jquery/dist/jquery.min.js');
config.addVendor('d3', bower_dir + '/d3/d3.min.js');

module.exports = config;
