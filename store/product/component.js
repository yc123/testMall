export const state = () => ({
  componentGoods: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_CMPGOODS (state) {
    state.componentGoods.fetching = true
  },
  GET_CMPGOODS_SUCCESS (state, result) {
    state.componentGoods.fetching = false
    state.componentGoods.data = result
  },
  GET_CMPGOODS_FAILURE (state) {
    state.fetching = false
  }
}
