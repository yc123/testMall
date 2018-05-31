export const state = () => ({
  keywords: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_KEYWORDS (state) {
    state.keywords.fetching = true
  },
  GET_KEYWORDS_FAILURE (state) {
    state.keywords.fetching = false
  },
  GET_KEYWORDS_SUCCESS (state, result) {
    state.keywords.fetching = false
    state.keywords.data = result
  },
  RESET_KEYWORDS (state) {
    state.keywords.data = []
  }
}
