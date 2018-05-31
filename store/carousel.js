export const state = () => ({
  banners: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_BANNER (state) {
    state.banners.fetching = true
  },
  GET_BANNER_FAILURE (state) {
    state.banners.fetching = false
  },
  GET_BANNER_SUCCESS (state, result) {
    state.banners.fetching = false
    state.banners.data = result
  }
}
