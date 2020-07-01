const fs = require('fs')

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    disableHostCheck: true,
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
    themeColor: '#fff',
    appleMobileWebAppCapable: 'yes',
    iconPaths: {
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      msTileImage: 'img/icons/mstile-150x150.png',
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/serviceWorker.js',
    },
    msTileColor: '#0055ff',
    manifestOptions: {
      background_color: '#fff',
      theme_color: 'transparent',
    },
  },
}
