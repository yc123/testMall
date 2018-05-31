export const state = () => ({
  lists: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_LIST (state) {
    state.lists.fetching = true
  },
  GET_LIST_FAILURE (state) {
    state.lists.fetching = false
  },
  GET_LIST_SUCCESS (state, result) {
    state.lists.fetching = false
    state.lists.data = result
  }
}
