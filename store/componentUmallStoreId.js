export const state = () => ({
  storeId: {
    fetching: false,
    data: ''
  }
})
export const mutations = {
  REQUEST_STOREID (state) {
    state.storeId.fetching = true
  },
  GET_STOREID_FAILURE (state) {
    state.storeId.fetching = false
  },
  GET_STOREID_SUCCESS (state, result) {
    state.storeId.fetching = false
    state.storeId.data = result
  }
}
