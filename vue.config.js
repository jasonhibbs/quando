const fs = require('fs')

module.exports = {
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Quando'
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
    sourceMap: true,
  },
  pwa: {
    name: 'Quando',
    appleMobileWebAppCapable: 'yes',
    iconPaths: {
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/serviceWorker.js',
    },
    msTileColor: '#4477ee',
    manifestOptions: {
      background_color: '#fff',
      theme_color: 'transparent',
    },
  },
}
