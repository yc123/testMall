export default function ({ isServer, store, req, redirect, route }) {
  // If nuxt generate, pass this middleware
  if (isServer && !req) return
  if (!store.state.option.user.logged) {
    let ua = req.headers['user-agent'].toLowerCase()
    if (ua.match(/micromessenger/i) && ua.match(/micromessenger/i)[0] === 'micromessenger' && req.url.indexOf('?code') === -1) {
      // 判断是浏览器，切不存在code
      return redirect(`/mobile/wechat/toggle?url=${route.path}`)
    } else if (ua.match(/micromessenger/i) && ua.match(/micromessenger/i)[0] === 'micromessenger' && req.url.indexOf('?code') > -1) {
      // 判断是浏览器，切不存在code
      return redirect(`/mobile/wechat?url=${route.path}`)
    } else {
      return redirect(`/auth/login?returnUrl=${'http://' + req.headers.host + route.fullPath}`)
    }
  }
}
