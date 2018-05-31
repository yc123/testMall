export const state = () => ({
  searchHistory: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_SEARCH_HISTORY (state) {
    state.searchHistory.fetching = true
  },
  GET_SEARCH_HISTORY_FAILURE (state) {
    state.searchHistory.fetching = false
  },
  GET_SEARCH_HISTORY_SUCCESS (state, result) {
    state.searchHistory.fetching = false
    state.searchHistory.data = result
  }
}
