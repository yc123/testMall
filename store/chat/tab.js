export const state = () => ({
  tab: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  GET_TABLE_SUCCESS (state, result) {
    state.tab.fetching = false
    state.tab.data = result
  }
}
