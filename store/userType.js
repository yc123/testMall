export const actions = {
  setUserType ({ commit }, params = {}) {
    commit('type/GET_TYPE_SUCCESS', params.type)
  }
}
