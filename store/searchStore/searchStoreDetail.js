export const state = () => ({
  detail: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_STORE (state) {
    state.detail.fetching = true
  },
  GET_STORE_FAILURE (state) {
    state.detail.fetching = false
  },
  GET_STORE_SUCCESS (state, result) {
    state.detail.fetching = false
    state.detail.data = result
  }
}
