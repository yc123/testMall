import Vue from 'vue'
import axios from 'axios'
import store from '~store'

const service = axios.create({
  withCredentials: true,
  baseUrl: '/'
})

// console.log(Vue)
// 第一次请求走这里, 拿不到store
service.interceptors.request.use(config => {
  // is server render, use ${baseUrl} directly rather than ${proxyUrl}
  config.url = config.url || '/'
  if (typeof window === 'undefined') {
    if (config.url.indexOf('/inquiry') === 0) {
      config.url = process.env.commonUrl + config.url
    } else {
      config.url = process.env.baseUrl + config.url
    }
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
  return response
}, error => {
  return Promise.reject(error)
})

Vue.prototype.$http = service
export default service
