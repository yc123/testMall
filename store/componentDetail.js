export const state = () => ({
  detail: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_DETAIL (state) {
    state.detail.fetching = true
  },
  GET_DETAIL_FAILURE (state) {
    state.detail.fetching = false
  },
  GET_DETAIL_SUCCESS (state, result) {
    state.detail.fetching = false
    state.detail.data = result
  }
}
