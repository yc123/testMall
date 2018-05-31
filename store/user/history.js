export const state = () => ({
  historyList: {
    fetching: false,
    data: []
  },
  deleteHistory: {
    fetching: false,
    data: []
  },
  cartCount: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_HISTORY (state) {
    state.historyList.fetching = true
  },
  GET_HISTORY_FAILURE (state) {
    state.historyList.fetching = false
  },
  GET_HISTORY_SUCCESS (state, result) {
    state.historyList.fetching = false
    state.historyList.data = result
  },
  REQUEST_DELETE (state) {
    state.deleteHistory.fetching = true
  },
  GET_DELETE_FAILURE (state) {
    state.deleteHistory.fetching = false
  },
  GET_DELETE_SUCCESS (state, result) {
    state.deleteHistory.fetching = false
    state.deleteHistory.data = result
  },
  REQUEST_CARTCOUNT (state) {
    state.cartCount.fetching = true
  },
  GET_CARTCOUNT_FAILURE (state) {
    state.cartCount.fetching = false
  },
  GET_CARTCOUNT_SUCCESS (state, result) {
    state.cartCount.fetching = false
    state.cartCount.data = result
  }
}
