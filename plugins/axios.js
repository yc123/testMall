import Vue from 'vue'
import axios from 'axios'
import store from '~store'

const service = axios.create({
  withCredentials: true,
  baseUrl: '/'
})

let reqCount = 0 // 请求计数器

const isServer = typeof window === 'undefined'
service.interceptors.request.use(config => {
  // is server render, use ${baseUrl} directly rather than ${proxyUrl}
  config.url = config.url || '/'
  reqCount++
  if (isServer) {
    if (config.url.indexOf('/inquiry') === 0) {
      config.url = process.env.commonUrl + config.url
    } else if (config.url.indexOf('/productsuer') === 0) {
      config.url = process.env.materialUrl + config.url
    } else {
      config.url = process.env.baseUrl + config.url
    }
    // console.log(config.url)
    // config.headers.cookie = store.state.option.cookies + '; ' + store.state.option.sessionId
    // config.headers['User-Agent']
  } else {
    document.getElementById('loading').setAttribute('class', 'loading in')
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  const cookies = response.headers['set-cookie']
  if (cookies && cookies.length) {
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].indexOf('JSESSIONID') > -1) {
        const sessionId = cookies[i]
        const first = sessionId.indexOf(';')
        const second = sessionId.lastIndexOf(';')
        const newSessionId = sessionId.replace(sessionId.substring(first, second), '')
        store.commit('option/SET_SESSION_ID', newSessionId)
        break
      }
    }
  }
  if (--reqCount <= 0 && !isServer) {
    document.getElementById('loading').setAttribute('class', 'loading')
  }
  return response
}, error => {
  if (--reqCount <= 0 && !isServer) {
    document.getElementById('loading').setAttribute('class', 'loading')
  }
  return Promise.reject(error)
})

Vue.prototype.$http = service
export default service
