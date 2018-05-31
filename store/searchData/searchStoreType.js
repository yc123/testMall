export const state = () => ({
  store_type: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_STORETYPE (state) {
    state.store_type.fetching = true
  },
  GET_STORETYPE_FAILURE (state) {
    state.store_type.fetching = false
  },
  GET_STORETYPE_SUCCESS (state, result) {
    state.store_type.fetching = false
    state.store_type.data = result
  }
}
