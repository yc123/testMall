export const state = () => ({
  bomList: {
    fetching: false,
    data: []
  },
  bomNumber: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_BOM_MATERIAL (state) {
    state.bomList.fetching = true
  },
  GET_BOM_MATERIAL_FAILURE (state) {
    state.bomList.fetching = false
  },
  GET_BOM_MATERIAL_SUCCESS (state, result) {
    state.bomList.fetching = false
    state.bomList.data = result
  },
  REQUEST_BOM_INFO (state) {
    state.bomNumber.fetching = true
  },
  GET_BOM_INFO_FAILURE (state) {
    state.bomNumber.fetching = false
  },
  GET_BOM_INFO_SUCCESS (state, result) {
    state.bomNumber.fetching = false
    state.bomNumber.data = result
  }
}

