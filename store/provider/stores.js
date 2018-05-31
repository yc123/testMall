export const state = () => ({
  storeList: {
    fetching: false,
    data: {}
  }
})

export const mutations = {
  REQUEST_STORE_LIST (state) {
    state.storeList.fetching = true
  },
  GET_STORE_LIST_FAILURE (state) {
    state.storeList.fetching = false
  },
  GET_STORE_LIST_SUCCESS (state, result = {}) {
    state.storeList.fetching = false
    state.storeList.data = result
  }
}
