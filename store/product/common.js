export const state = () => ({
  counts: {
    fetching: false,
    data: []
  },
  collectSave: {
    fetching: false,
    data: []
  },
  collectList: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_COUNTS (state) {
    state.counts.fetching = true
  },
  GET_COUNTS_FAILURE (state) {
    state.counts.fetching = false
  },
  GET_COUNTS_SUCCESS (state, result) {
    state.counts.fetching = false
    state.counts.data = result
  },
  REQUEST_COLLECTSAVA (state) {
    state.collectSave.fetching = true
  },
  GET_COLLECTSAVA_FAILURE (state) {
    state.collectSave.fetching = false
  },
  GET_COLLECTSAVA_SUCCESS (state, result) {
    state.collectSave.fetching = false
    state.collectSave.data = result
  },
  REQUEST_COLLECTLIST (state) {
    state.collectList.fetching = true
  },
  GET_COLLECTLIST_FAILURE (state) {
    state.collectList.fetching = false
  },
  GET_COLLECTLIST_SUCCESS (state, result) {
    state.collectList.fetching = false
    state.collectList.data = result
  }
}
