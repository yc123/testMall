export const state = () => ({
  allNews: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_ALLNEWS (state) {
    state.allNews.fetching = true
  },
  GET_ALLNEWS_FAILURE (state) {
    state.allNews.fetching = false
  },
  GET_ALLNEWS_SUCCESS (state, result) {
    state.allNews.fetching = false
    state.allNews.data = result
  }
}
