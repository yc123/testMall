export const state = () => ({
  kinds: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_KINDS (state) {
    state.kinds.fetching = true
  },
  GET_KINDS_FAILURE (state) {
    state.kinds.fetching = false
  },
  GET_KINDS_SUCCESS (state, result) {
    state.kinds.fetching = false
    state.kinds.data = result
  }
}
