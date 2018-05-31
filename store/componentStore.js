export const state = () => ({
  store: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_STORE (state) {
    state.store.fetching = true
  },
  GET_STORE_FAILURE (state) {
    state.store.fetching = false
  },
  GET_STORE_SUCCESS (state, result) {
    state.store.fetching = false
    state.store.data = result
  }
}
