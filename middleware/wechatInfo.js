export default function ({ isServer, store, req, redirect, route }) {
  if (isServer && !req) return
  if (!store.state.option.user.logged) {
    let ua = store.state.option.userAgent.toLowerCase()
    if (ua.match(/micromessenger/i) && ua.match(/micromessenger/i)[0] === 'micromessenger' && req.url.indexOf('?code') === -1) {
      // 判断是浏览器，切不存在code
      return redirect(`/mobile/wechat/toggle?url=${route.path}`)
    }
  }
}
