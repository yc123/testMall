export const state = () => ({
  information: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_INFORMATION (state) {
    state.information.fetching = true
  },
  GET_INFORMATION_FAILURE (state) {
    state.information.fetching = false
  },
  GET_INFORMATION_SUCCESS (state, result) {
    state.information.fetching = false
    state.information.data = result
  }
}
