export const state = () => ({
  brands: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_BRANDS (state) {
    state.brands.fetching = true
  },
  GET_BRANDS_FAILURE (state) {
    state.brands.fetching = false
  },
  GET_BRANDS_SUCCESS (state, result) {
    state.brands.fetching = false
    state.brands.data = result
  }
}
