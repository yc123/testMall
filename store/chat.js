export const actions = {
  setChatTab ({ commit }, params = {}) {
    commit('tab/GET_TABLE_SUCCESS', params.tab)
  }
}
