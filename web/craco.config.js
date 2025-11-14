const CracoLessPlugin = require('craco-less')
const webpack = require('webpack')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#0088CC' },
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  webpack: {
    configure: (webpackConfig) => {
      // Add polyfills for Node.js core modules (webpack 5)
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        events: require.resolve('events'),
        util: require.resolve('util'),
        constants: require.resolve('constants-browserify'),
        querystring: require.resolve('querystring-es3'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        vm: require.resolve('vm-browserify'),
        // Node.js modules without browser equivalents
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        dns: false,
        dgram: false
      }

      // Provide process/Buffer globals
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer']
        })
      )

      return webpackConfig
    }
  }
}
