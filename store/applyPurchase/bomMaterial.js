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
  ADD_BOM_MATERIAL_BY_SPOT_GOODS (state, result) {
    if (result.$index === 0) {
      state.bomList.data.content = []
    }
    state.bomList.data.content.push(result)
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

