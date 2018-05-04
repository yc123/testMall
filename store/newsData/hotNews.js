export const state = () => ({
  hotNews: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_HOTNEWS (state) {
    state.hotNews.fetching = true
  },
  GET_HOTNEWS_FAILURE (state) {
    state.hotNews.fetching = false
  },
  GET_HOTNEWS_SUCCESS (state, result) {
    state.hotNews.fetching = false
    state.hotNews.data = result.content
  }
}
