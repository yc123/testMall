export const state = () => ({
  component: {
    fetching: false,
    data: []
  }
})
export const mutations = {
  REQUEST_COMPONENT (state) {
    state.component.fetching = true
  },
  GET_COMPONENT_FAILURE (state) {
    state.component.fetching = false
  },
  GET_COMPONENT_SUCCESS (state, result) {
    state.component.fetching = false
    state.component.data = result
  }
}
