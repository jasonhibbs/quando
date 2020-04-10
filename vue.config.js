const fs = require('fs')

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Since Then'
      return args
    })
  },
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    disableHostCheck: true,
    // public: 'https://localhost:8080/',
    // https: {
    //   key: fs.readFileSync('./certs/local-key.pem'),
    //   cert: fs.readFileSync('./certs/local-cert.pem'),
    // },
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          precision: 8,
        },
      },
    },
  },
  pwa: {
    name: 'Since Then',
    appleMobileWebAppCapable: 'yes',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/serviceWorker.js',
    },
  },
}
