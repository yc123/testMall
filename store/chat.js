export const actions = {
  setChatTab ({ commit }, params = {}) {
    console.log(params)
    commit('tab/GET_TABLE_SUCCESS', params.tab)
  }
}
