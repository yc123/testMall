export const state = () => ({
  categories: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_CATEGORIES (state) {
    state.categories.fetching = true
  },
  GET_CATEGORIES_FAILURE (state) {
    state.categories.fetching = false
  },
  GET_CATEGORIES_SUCCESS (state, result) {
    state.categories.fetching = false
    state.categories.data = result
  }
}
