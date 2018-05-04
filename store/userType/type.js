export const state = () => ({
  type: {
    fetching: false,
    data: 'mall'
  }
})

export const mutations = {
  GET_TYPE_SUCCESS (state, result) {
    state.type.fetching = false
    state.type.data = result
  }
}
