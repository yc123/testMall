import axios from '~plugins/axios'

/**
 * 获取某店铺的交易量
 *
 * @param store   店铺信息
 */
function countStoreOrderCount (store) {
  return axios.get('/api/provider/order/storeid/' + store.uuid + '/count')
}
function findStoreFocusInMobil (store) {
  return axios.get('/trade/storeFocus/ifFocus?storeid=' + store.id)
}
export const actions = {
  // 获取销售排行榜信息
  loadSalesStore ({ commit }, params = {isOriginal: false}) {
    commit('storeCms/REQUEST_SALES')
    return axios.get('/api/store-service/stores', {
      params: {
        filter: 'topBySales',
        isOriginal: params.isOriginal
      }
    }).then(response => {
      let stores = response.data || []
      let orderCounts = []
      for (let i = 0; i < stores.length; i++) {
        orderCounts.push(countStoreOrderCount(stores[i]))
      }
      // 合并请求，获取店铺的交易量数据
      return Promise.all(orderCounts)
        .then(result => {
          if (result) {
            for (let i = 0; i < result.length; i++) {
              stores[i].orderCount = result[i].data ? result[i].data.orderCount : 0
            }
          }
          commit('storeCms/GET_SALES_SUCCESS', stores)
        }, err => {
          commit('storeCms/GET_SALES_FAILURE', err)
        })
    }, err => {
      commit('storeCms/GET_SALES_FAILURE', err)
    })
  },
  // 获取新开店铺信息
  loadNewStores ({ commit }, params = { types: 'ORIGINAL_FACTORY' }) {
    commit('storeCms/REQUEST_NEW_STORES')
    return axios.get('/api/store-service/stores', {
      params: {
        filter: 'newStore',
        types: params.types
      }
    }).then(response => {
      commit('storeCms/GET_NEW_STORES_SUCCESS', response.data)
      commit('storeCms/REQUEST_STORE_COUNT')
      return axios.get('/api/store-service/stores/type/count', {
        params: {
          types: params.types
        }
      }).then(response => {
        commit('storeCms/GET_STORE_COUNT_SUCCESS', response.data && response.data.success ? response.data.data : 0)
      }, err => {
        commit('storeCms/GET_STORE_COUNT_FAILURE', err)
      })
    }, err => {
      commit('storeCms/GET_NEW_STORES_FAILURE', err)
    })
  },
  // 获取原厂推荐信息
  loadRecommendOriginal ({ commit }, params = {}) {
    commit('storeCms/REQUEST_RECOMMEND_STORE')
    return axios.get('/api/store-service/stores/five', { params })
      .then(response => {
        commit('storeCms/GET_RECOMMEND_STORE_SUCCESS', response.data)
      }, err => {
        commit('storeCms/GET_RECOMMEND_STORE_FAILURE', err)
      })
  },
  // 获取优秀商家信息
  loadRecommendStores ({ commit }, params = {}) {
    commit('storeCms/REQUEST_RECOMMEND_STORE')
    return axios.get('/api/cms-service/storeIn', { params })
      .then(response => {
        commit('storeCms/GET_RECOMMEND_STORE_SUCCESS', response.data)
      }, err => {
        commit('storeCms/GET_RECOMMEND_STORE_FAILURE', err)
      })
  },
  loadHotComponents ({ commit }) {
    commit('storeCms/REQUEST_HOT_COMPONENTS')
    return axios.get('/api/cms-service/storeCms/inventory')
      .then(response => {
        commit('storeCms/GET_HOT_COMPONENTS_SUCCESS', response.data)
      }, err => {
        commit('storeCms/GET_HOT_COMPONENTS_FAILURE', err)
      })
  },
  findStoreList ({ commit }, params = {}) {
    params.op = 'pageByType'
    commit('stores/REQUEST_STORE_LIST')
    return axios.get('/api/store-service/stores', { params })
      .then(response => {
        commit('stores/GET_STORE_LIST_SUCCESS', response.data)
      }, err => {
        commit('stores/GET_STORE_LIST_FAILURE', err)
      })
  },
  findStoreListInMobil ({ commit }, params = {}) {
    params.op = 'pageByType'
    commit('stores/REQUEST_STORE_LIST')
    return axios.get('/api/store-service/stores', { params })
      .then(response => {
        let listData = response.data
        let focusData = []
        for (let i = 0; i < listData.content.length; i++) {
          let str = findStoreFocusInMobil({id: listData.content[i].id})
          focusData.push(str)
        }
        // 合并请求，获取店铺关注信息
        return Promise.all(focusData)
          .then(result => {
            if (result) {
              for (let i = 0; i < result.length; i++) {
                listData.content[i].isFocus = result[i] ? result[i].data : 'false'
              }
            }
            commit('stores/GET_STORE_LIST_SUCCESS', listData)
          }, err => {
            console.log(err)
            for (let i = 0; i < listData.content.length; i++) {
              listData.content[i].isFocus = 'false'
            }
            commit('stores/GET_STORE_LIST_SUCCESS', listData)
          })
      }, err => {
        commit('stores/GET_STORE_LIST_FAILURE', err)
      })
  }
}
