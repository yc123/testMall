import axios from '~plugins/axios'

export const actions = {
  // 获取搜索店铺数据
  searchStoreDetail ({ commit }, params = {}) {
    commit('searchStoreDetail/REQUEST_STORE', params)
    return axios.get(`/search/stores`, {params})
      .then(response => {
        commit('searchStoreDetail/GET_STORE_SUCCESS', response.data)
      }, err => {
        commit('searchStoreDetail/GET_STORE_FAILURE', err)
      })
  }
}

