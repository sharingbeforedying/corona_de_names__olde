//webpack.config.js
const webpack = require('webpack');
const path    = require('path');


// const angular   = require('angular');
// const angular_ui = require('angular-ui');

const commonConfig = {
  //common Configuration
  module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
      },
      { test: /\.html$/, use: "html-loader" },
      { test: /\.css$/, use: "css-loader" }
    ]
  },
  devtool: "#inline-source-map",
};

const angularConfig = Object.assign({}, commonConfig, {
  name: "angular",

  // entry: require('angular'), //not working
  // entry: path.resolve(__dirname, "../node_modules/angular/angular"),

  entry: [
    path.resolve(__dirname, "../node_modules/angular/angular.min.js"),
    path.resolve(__dirname, "../node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"),
  ],

  output: {
     path: path.resolve(__dirname,"./dist"),
     filename: "angular.bundle.js"
  },
});

const appConfig = Object.assign({}, commonConfig,{
  name: "app",
  entry: path.resolve(__dirname, "./app/app.js"),
  output: {
     path: path.resolve(__dirname,"./bin"),
     filename: "app.bundle.js"
  },
});

// Return Array of Configurations
module.exports = [
  angularConfig,
  appConfig,
];
