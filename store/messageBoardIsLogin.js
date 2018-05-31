export const state = () => ({
  login: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_LOGIN (state) {
    state.login.fetching = true
  },
  GET_LOGIN_FAILURE (state) {
    state.login.fetching = false
  },
  GET_LOGIN_SUCCESS (state, result) {
    state.login.fetching = false
    state.login.data = result
  }
}
