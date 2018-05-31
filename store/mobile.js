/*
 * 全局设置
 */
export const state = () => ({
  // 输入框是否被点击
  InputGetFocus: false
})

export const mutations = {
  SET_INPUT_STATUS (state, flag) {
    state.InputGetFocus = flag
  }
}

export const actions = {
  SetInputGetFocus({commit}, flag) {
    commit('SET_INPUT_STATUS', flag)
  }
}
