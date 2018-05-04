export const state = () => ({
  recommends: {
    fetching: false,
    data: []
  },
  brandList: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_RECOMMENDS (state) {
    state.recommends.fetching = true
  },
  GET_RECOMMENDS_SUCCESS (state, result) {
    state.recommends.fetching = false
    state.recommends.data = result
  },
  GET_RECOMMENDS_FAILURE (state) {
    state.recommends.fetching = false
  },
  REQUEST_BRANDS (state) {
    state.brandList.fetching = true
  },
  GET_BRANDS_SUCCESS (state, result) {
    state.brandList.fetching = false
    state.brandList.data = result
  },
  GET_BRANDS_FAILURE (state) {
    state.brandList.fetching = false
  }
}
