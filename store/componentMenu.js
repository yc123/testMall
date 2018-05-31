export const state = () => ({
  menu: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_MENU (state) {
    state.menu.fetching = true
  },
  GET_MENU_FAILURE (state) {
    state.menu.fetching = false
  },
  GET_MENU_SUCCESS (state, result) {
    state.menu.fetching = false
    state.menu.data = result
  }
}
