/*
 * 全局设置
 */
export const state = () => ({
  userAgent: '',
  // 是否移动端
  isMobile: false,
  // 身份token
  cookies: '',
  // 用户身份SessionId
  sessionId: '',
  // 正式系统地址
  url: 'http://218.17.158.219:9090/platform-b2c',
  // 用户信息
  user: {
    // 是否登录
    logged: false,
    fetching: false,
    data: {}
  },
  // 系统设置
  globalOptions: {
    fetching: false,
    data: {}
  },
  storeStatus: {
    fetching: false,
    data: {}
  },
  infoWithAdmin: {
    fetching: false,
    data: {}
  },
  // 微信用户信息
  wechatInfo: {
    fetching: false,
    data: {}
  }
})

export const mutations = {
  SET_USER_AGENT (state, result) {
    state.userAgent = result
  },
  SET_MOBILE_LAYOUT (state, result) {
    state.isMobile = result
  },
  SET_COOKIES (state, result) {
    state.cookies = result || ''
  },
  ADD_COOKIES (state, result) {
    state.cookies += result || ''
  },
  SET_SESSION_ID (state, result) {
    state.sessionId = result || ''
  },
  UPDATE_URL (state, result) {
    state.url = result
  },
  REQUEST_USER_INFO (state) {
    state.user.fetching = true
  },
  REQUEST_USER_INFO_SUCCESS (state, result) {
    state.user.fetching = false
    state.user.data = result || {}
    state.user.logged = result && result.userName
  },
  REQUEST_USER_INFO_FAILURE (state) {
    state.user.fetching = false
    state.user.data = {}
  },
  REQUEST_ADMIN_INFO (state) {
    state.infoWithAdmin.fetching = true
  },
  REQUEST_ADMIN_INFO_SUCCESS (state, result) {
    state.infoWithAdmin.fetching = false
    state.infoWithAdmin.data = result || {}
  },
  REQUEST_ADMIN_INFO_FAILURE (state) {
    state.user.fetching = false
    state.infoWithAdmin.data = {}
  },
  REQUEST_LOGOUT_SUCCESS (state) {
    state.user.data = {}
    state.user.logged = false
  },
  REQUEST_GLOBAL_OPTIONS (state) {
    state.globalOptions.fetching = true
  },
  REQUEST_GLOBAL_OPTIONS_SUCCESS (state, result) {
    state.globalOptions.fetching = false
    state.globalOptions.data = result
  },
  REQUEST_GLOBAL_OPTIONS_FAILURE (state) {
    state.globalOptions.fetching = false
  },
  REQUEST_STORE_STATUS (state) {
    state.storeStatus.fetching = true
  },
  REQUEST_STORE_STATUS_SUCCESS(state, result) {
    state.storeStatus.fetching = false
    state.storeStatus.data = result
  },
  REQUEST_STORE_STATUS_FAILURE (state) {
    state.storeStatus.fetching = false
    state.storeStatus.data = {}
  },

  REQUEST_WECHATINFO_STATUS (state) {
    state.wechatInfo.fetching = true
  },
  REQUEST_WECHATINFO_STATUS_SUCCESS(state, result) {
    state.wechatInfo.fetching = false
    state.wechatInfo.data = result
  },
  REQUEST_WECHATINFO_STATUS_FAILURE (state) {
    state.wechatInfo.fetching = false
  }
}
