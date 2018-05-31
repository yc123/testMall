export const state = () => ({
  snapsho: {
    fetching: false,
    data: []
  },
  helplist: {
    fetching: false,
    data: []
  },
  detail: {
    fetching: false,
    data: []
  },
  title: {
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
  },
  REQUEST_HELPLIST (state) {
    state.helplist.fetching = true
  },
  GET_HELPLIST_FAILURE (state) {
    state.helplist.fetching = false
  },
  GET_HELPLIST_SUCCESS (state, result) {
    state.helplist.fetching = false
    state.helplist.data = result
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
  },
  REQUEST_TITLE (state) {
    state.title.fetching = true
  },
  GET_TITLE_FAILURE (state) {
    state.title.fetching = false
  },
  GET_TITLE_SUCCESS (state, result) {
    state.title.fetching = false
    state.title.data = result
  }
}
