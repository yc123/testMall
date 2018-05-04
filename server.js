const Nuxt = require('nuxt')
const app = require('express')()
const proxy = require('http-proxy-middleware')
const cookiejar = require('cookiejar')
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
process.noDeprecation = true
// const url = require('url')

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// 请求代理，dev模式下使用，接口服务器如果支持跨域可去掉
const proxyTable = config.proxyTable
if (proxyTable) {
  // 本地代理支持localhost、127.0.0.1等不同地址跨域
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Credentials', 'true')
    // const refer = res.req.headers.referer
    // if (refer && url.parse(refer, true).query.type === 'erp') {
    //   res.cookie('type', 'erp')
    // }
    next()
  })
  const defaultOptions = {
    target: config.env.baseUrl,
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
      const setCookieHeaders = proxyRes.headers['set-cookie'] || []
      const modifiedSetCookieHeaders = setCookieHeaders
        .map(str => new cookiejar.Cookie(str))
        .map(cookie => {
          cookie.path = '/'
          return cookie
        })
        .map(cookie => cookie.toString())
      proxyRes.headers['set-cookie'] = modifiedSetCookieHeaders
    }
  }
  if (Array.isArray(proxyTable)) {
    app.use(proxy(proxyTable, defaultOptions))
  } else {
    Object.keys(proxyTable).forEach((context) => {
      var options = proxyTable[context]
      if (typeof options === 'string') {
        options = {target: options}
      }
      app.use(proxy(context, Object.assign(defaultOptions, options)))
    })
  }
  // axios use proxy url
  config.env.proxyUrl = '/'
}

// Init Nuxt.js
const nuxt = new Nuxt(config)
app.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
    .catch((error) => {
      // eslint-disable-line no-console
      console.error(error)
      process.exit(1)
    })
}

// Listen the server
app.listen(port)
// eslint-disable-line no-console
console.log(`Nuxt.js SSR Server listening on ${host} : ${port}, at ${new Date().toLocaleString()} \nusing api ${config.env.baseUrl}`)
