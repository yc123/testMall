const path = require('path')
const isProdMode = Object.is(process.env.NODE_ENV, 'production')
const baseUrl = process.env.BASE_URL || (isProdMode ? 'http://192.168.253.60:9090/platform-b2c/' : 'http://192.168.253.121:9090/platform-b2c')
const commonUrl = process.env.COMMON_URL || (isProdMode ? 'https://api-inquiry.usoftmall.com/' : 'http://218.17.158.219:24000/')

module.exports = {
  router: {
    middleware: 'check-auth'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '【优软商城】IC电子元器件现货采购交易平台商城',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
      { name: 'render', content: 'webkit' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '优软商城（usoftmall.com）是中国领先的IC电子元器件现货采购交易网上商城，提供上千万种电子元器件现货采购交易，采购电子元器件就上优软商城！' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** loading Style
  */
  loading: '~components/common/loading/Loading.vue',
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLINT on save
    */
    extend(config, { dev, isClient, isServer }) {
      config.resolve.alias['~utils'] = path.join(__dirname, 'utils')
      config.module.rules.push({
        test: /\.(scss|css)$/,
        loader: 'vue-style-loader!css-loader!sass-loader'
      })
      config.module.rules.push({
        test: /\.js$/,
        loader: 'babel-loader'
      })
      if (isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: [
      'axios',
      'swiper',
      'element-ui'
    ],
    babel: {
      presets: ['es2015', 'stage-2'],
      plugins: [
        'transform-async-to-generator',
        'transform-runtime'
      ],
      comments: true
    },
    postcss: [
      require('autoprefixer')({
        browsers: ['last 3 versions']
      })
    ]
  },
  css: [
    { src: '~assets/scss/app.scss', lang: 'scss' }
    /* {
      src: 'swiper/dist/css/swiper.css'
    } */ /* , {
      src: 'element-ui/lib/theme-default/index.css'
    } */
  ],
  dev: !isProdMode,
  env: {
    baseUrl,
    commonUrl
  },
  plugins: [{
    src: '~plugins/axios.js'
  }, {
    src: '~plugins/vue-filter.js'
  }, {
    src: '~plugins/mixin.js'
  }, {
    src: '~plugins/swiper.js',
    ssr: false
  }, {
    src: '~plugins/vue-loading.js',
    ssr: false
  }, {
    src: '~plugins/vue-empty.js',
    ssr: false
  }, {
    src: '~plugins/element-ui.js',
    ssr: true
  }, {
    src: '~plugins/filters.js',
    ssr: false
  }, {
    src: '~plugins/jsonp.js',
    ssr: false
  }],
  // proxyTable: ['/api/**', '/search/**', '/user/**', '/login/**', '/register/**', '/logout/**', '/static/**', '/vendor**', '/user**', '/trade/**', '/recommendation/**', '/store-service/**', '/basic/**', '/logout**', '/operation/**', '/help**', '/product**', '/store**', '/order/proxy**', '/report/**', '/store/**#/**', '/kdn/**', '/product/**Submit', '/admin**', '/product/**Submit/**', '/release/**', '/auth/store/**', '/produce/**', '/file**', '/rate/**', '/log/**', '/help-service/**', '/keyword/**', '/tip/**', '/UASBatchPutOnProperty**', '/UASBatchPutOnProperty/**']
  /**
   * http-proxy configuration example: {
   *    '/api/order/**': 'https://api-order.example.com',
   *    '/api/product/**': 'https://api-product.example.com'
   *   }
   */
  proxyTable: {
    '/api/**': baseUrl,
    '/search/**': baseUrl,
    '/user/**': baseUrl,
    '/user**': baseUrl,
    '/login/**': baseUrl,
    '/newLogin/**': baseUrl,
    '/mPassWord/page': baseUrl,
    '/mEmail/page': baseUrl,
    '/mPhone/page': baseUrl,
    '/mQuestion/page': baseUrl,
    '/realNameAuth/page': baseUrl,
    '/register/**': baseUrl,
    '/logout/**': baseUrl,
    '/static/**': baseUrl,
    '/vendor**': baseUrl,
    '/trade/**': baseUrl,
    '/recommendation/**': baseUrl,
    '/store-service/**': baseUrl,
    '/basic/**': baseUrl,
    '/logout**': baseUrl,
    '/operation/**': baseUrl,
    '/help**': baseUrl,
    '/product**': baseUrl,
    '/store**': baseUrl,
    '/order/proxy**': baseUrl,
    '/report/**': baseUrl,
    '/store/**#/**': baseUrl,
    '/kdn/**': baseUrl,
    '/product/**Submit': baseUrl,
    '/admin**': baseUrl,
    '/product/**Submit/**': baseUrl,
    '/release/**': baseUrl,
    '/auth/store/**': baseUrl,
    '/produce/**': baseUrl,
    '/file**': baseUrl,
    '/rate/**': baseUrl,
    '/log/**': baseUrl,
    '/help-service/**': baseUrl,
    '/keyword/**': baseUrl,
    '/tip/**': baseUrl,
    '/UASBatchPutOnProperty**': baseUrl,
    '/UASBatchPutOnProperty/**': baseUrl,
    '/seek/**': baseUrl,
    '/inquiry/**': commonUrl,
    '/b2b/**': baseUrl,
    '/commodity-service/**': baseUrl,
    '/background/**': baseUrl,
    '/goods/**': baseUrl
  }
}
