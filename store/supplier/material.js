export const state = () => ({
  material: {
    fetching: false,
    data: []
  },
  enUser: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_MATERIAL (state) {
    state.material.fetching = true
  },
  GET_MATERIAL_SUCCESS (state, result) {
    state.material.fetching = false
    state.material.data = result
  },
  GET_MATERIAL_FAILURE (state) {
    state.material.fetching = false
  },
  REQUEST_ENUSER (state) {
    state.enUser.fetching = true
  },
  GET_ENUSER_SUCCESS (state, result) {
    state.enUser.fetching = false
    state.enUser.data = result
  },
  GET_ENUSER_FAILURE (state) {
    state.enUser.fetching = false
    state.enUser.data = {}
  }
}
