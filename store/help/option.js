export const state = () => ({
  snapshot: {
    fetching: false,
    data: []
  },
  detail: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_SNAPSHO (state) {
    state.snapsho.fetching = true
  },
  GET_SNAPSHO_FAILURE (state) {
    state.snapsho.fetching = false
  },
  GET_SNAPSHO_SUCCESS (state, result) {
    state.snapsho.fetching = false
    state.snapsho.data = result
  }
}
