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
  REQUEST_SNAPSHOT (state) {
    state.snapshot.fetching = true
  },
  GET_SNAPSHOT_FAILURE (state) {
    state.snapshot.fetching = false
  },
  GET_SNAPSHOT_SUCCESS (state, result) {
    state.snapshot.fetching = false
    state.snapshot.data = result.content
  },
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
