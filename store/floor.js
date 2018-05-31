export const state = () => ({
  list: {
    fetching: false,
    data: []
  },
  list_v3: {
    fetching: false,
    data: []
  },
  list_expand: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_LIST (state) {
    state.list.fetching = true
  },
  GET_LIST_FAILURE (state) {
    state.list.fetching = false
  },
  GET_LIST_SUCCESS (state, result) {
    state.list.fetching = false
    state.list.data = result
  },
  REQUEST_NEWLIST (state) {
    state.list_v3.fetching = true
  },
  GET_NEWLIST_FAILURE (state) {
    state.list_v3.fetching = false
  },
  GET_NEWLIST_SUCCESS (state, result) {
    state.list_v3.fetching = false
    state.list_v3.data = result
  },
  REQUEST_EXPANDLIST (state) {
    state.list_expand.fetching = true
  },
  GET_EXPANDLIST_FAILURE (state) {
    state.list_expand.fetching = false
  },
  GET_EXPANDLIST_SUCCESS (state, result) {
    state.list_expand.fetching = false
    state.list_expand.data = result
  }
}
