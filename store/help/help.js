import axios from '~plugins/axios'

export const actions = {
  // 获取帮助中心信息
  loadHelpSnapsho ({ commit }, params = {}) {
    commit('help/option/REQUEST_SNAPSHO')
    return axios.get('api/help-service/helps', {params})
      .then(response => {
        commit('help/option/GET_SNAPSHO_SUCCESS', response.data)
      }, err => {
        commit('help/option/GET_SNAPSHO_FAILURE', err)
      })
  }
}
