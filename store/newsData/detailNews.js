export const state = () => ({
  detailNews: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_DETAILNEWS (state) {
    state.detailNews.fetching = true
  },
  GET_DETAILNEWS_FAILURE (state) {
    state.detailNews.fetching = false
  },
  GET_DETAILNEWS_SUCCESS (state, result) {
    state.detailNews.fetching = false
    state.detailNews.data = result
  }
}

