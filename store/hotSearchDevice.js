export const state = () => ({
  hot: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_HOT (state) {
    state.hot.fetching = true
  },
  GET_HOT_FAILURE (state) {
    state.hot.fetching = false
  },
  GET_HOT_SUCCESS (state, result) {
    state.hot.fetching = false
    state.hot.data = result
  }
}
