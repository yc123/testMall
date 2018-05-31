export const state = () => ({
  addCarInfo: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_CAR (state) {
    state.addCarInfo.fetching = true
  },
  GET_CAR_FAILURE (state) {
    state.addCarInfo.fetching = false
  },
  GET_CAR_SUCCESS (state, result) {
    state.addCarInfo.fetching = false
    state.addCarInfo.data = result
  }
}
