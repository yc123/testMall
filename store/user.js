import axios from '~/plugins/axios'

export const actions = {
  // 获取浏览记录
  loadHistory ({ commit }, params = {}) {
    commit('history/REQUEST_HISTORY')
    return axios.get('/trade/history/goods/list', {params})
      .then(response => {
        commit('history/GET_HISTORY_SUCCESS', response.data)
      }, err => {
        commit('history/GET_HISTORY_FAILURE', err)
      })
  },
  // 删除一条历史记录
  deleteHistory ({ commit }, params = {}) {
    commit('history/REQUEST_DELETE')
    return axios.post(`/trade/history/goods/setDelete?id=${params.id}`, {})
      .then(response => {
        commit('history/GET_DELETE_SUCCESS', response.data)
      }, err => {
        commit('history/GET_DELETE_FAILURE', err)
      })
  },
  // 获取购物车数量
  CarCount ({ commit }, params = {}) {
    commit('history/REQUEST_CARTCOUNT')
    return axios.get(`/trade/cart/count`, {params})
      .then(response => {
        commit('history/GET_CARTCOUNT_SUCCESS', response.data)
      }, err => {
        commit('history/GET_CARTCOUNT_FAILURE', err)
      })
  },
  // 获取购买信息
  getBuyInfo ({ commit }, params) {
    commit('buy/REQUEST_BUY')
    return axios.post(`/trade/order/buyNow`, params)
      .then(response => {
        commit('buy/GET_BUY_SUCCESS', response.data)
      }, err => {
        commit('buy/GET_BUY_FAILURE', err)
      })
  },
  // 加入购物车
  addCar ({ commit }, params) {
    commit('car/REQUEST_CAR')
    return axios.post(`/trade/cart/add`, params)
      .then(response => {
        commit('car/GET_CAR_SUCCESS', response.data)
      }, err => {
        commit('car/GET_CAR_FAILURE', err)
      })
  }
}
