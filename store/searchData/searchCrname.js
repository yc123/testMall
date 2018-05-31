export const state = () => ({
  crname: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_CRNAME (state) {
    state.crname.fetching = true
  },
  GET_CRNAME_FAILURE (state) {
    state.crname.fetching = false
  },
  GET_CRNAME_SUCCESS (state, result) {
    state.crname.fetching = false
    state.crname.data = result
  }
}
