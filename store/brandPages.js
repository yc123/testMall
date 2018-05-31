export const state = () => ({
  pages: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_PAGES (state) {
    state.pages.fetching = true
  },
  GET_PAGES_FAILURE (state) {
    state.pages.fetching = false
  },
  GET_PAGES_SUCCESS (state, result) {
    state.pages.fetching = false
    state.pages.data = result
  }
}
