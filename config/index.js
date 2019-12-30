'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const fs = require('fs')
const configs = JSON.parse(fs.readFileSync('settings.json'))

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/openapi': {
        target: 'http://test-creditcenter-f-88.paas.op.mljr.com',
        changeOrigin: true,
        pathRewrite: {
            '^/openapi': '/openapi'
        }
      },
      '/sso': {
        target: 'http://test-datasso.paas.op.mljr.com',
        changeOrigin: true,
        pathRewrite: {
            '^/sso': ''
        }
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8899, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: true,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },
  qa: {
      env: require('./test.env'),
      index: path.resolve(__dirname, configs.deploy.qa.buildIndex),
      assetsRoot: path.resolve(__dirname, configs.deploy.qa.assetsRoot),
      assetsSubDirectory: configs.deploy.qa.assetsSubDirectory,
      assetsPublicPath: configs.deploy.qa.assetsPublicPath,
      productionSourceMap: true,
      // Gzip off by default as many popular static hosts such as
      // Surge or Netlify already gzip all static assets for you.
      // Before setting to `true`, make sure to:
      // npm install --save-dev compression-webpack-plugin
      productionGzip: false,
      productionGzipExtensions: ['js', 'css'],
      // Run the build command with an extra argument to
      // View the bundle analyzer report after build finishes:
      // `npm run build --report`
      // Set to `true` or `false` to always turn it on or off
      bundleAnalyzerReport: process.env.npm_config_report
    },
    build: {
      env: require('./prod.env'),
      index: path.resolve(__dirname, configs.deploy.www.buildIndex),
      assetsRoot: path.resolve(__dirname, configs.deploy.www.assetsRoot),
      assetsSubDirectory: configs.deploy.www.assetsSubDirectory,
      assetsPublicPath: configs.deploy.www.assetsPublicPath,

      /**
       * Source Maps
       */

      productionSourceMap: true,
      // https://webpack.js.org/configuration/devtool/#production
      devtool: '#source-map',

      // Gzip off by default as many popular static hosts such as
      // Surge or Netlify already gzip all static assets for you.
      // Before setting to `true`, make sure to:
      // npm install --save-dev compression-webpack-plugin
      productionGzip: false,
      productionGzipExtensions: ['js', 'css'],

      // Run the build command with an extra argument to
      // View the bundle analyzer report after build finishes:
      // `npm run build --report`
      // Set to `true` or `false` to always turn it on or off
      bundleAnalyzerReport: process.env.npm_config_report
    }
}