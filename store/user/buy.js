export const state = () => ({
  buyInfo: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_BUY (state) {
    state.buyInfo.fetching = true
  },
  GET_BUY_FAILURE (state) {
    state.buyInfo.fetching = false
  },
  GET_BUY_SUCCESS (state, result) {
    state.buyInfo.fetching = false
    state.buyInfo.data = result
  }
}
