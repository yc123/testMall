import axios from '~plugins/axios'

// 载入历史记录
function StoreFocusList ({ commit }, params = {}) {
  commit('storeInfo/REQUEST_FOCUSLIST')
  return axios.get(`/trade/storeFocus/ifFocus?storeid=${params.id}`)
    .then(response => {
      commit('storeInfo/GET_FOCUSLIST_SUCCESS', response.data)
    }, err => {
      commit('storeInfo/GET_FOCUSLIST_FAILURE', err)
    })
}
// 根据UUID获取某店铺信息
function findStoreInfoFromUuid ({ commit }, params = {}) {
  commit('storeInfo/REQUEST_STORE_INFO')
  return axios.get('/api/store-service/stores', { params })
    .then(response => {
      commit('storeInfo/GET_STORE_INFO_SUCCESS', response.data)
      return Promise.all([
        StoreFocusList({ commit }, {id: response.data.id})
      ])
    }, err => {
      commit('storeInfo/GET_STORE_INFO_FAILURE', err)
    })
}

export const actions = {
  // 根据UUID获取某店铺信息
  findStoreInfoFromUuid ({ commit }, params = {}) {
    commit('storeInfo/REQUEST_STORE_INFO')
    return axios.get('/api/store-service/stores', { params })
      .then(response => {
        commit('storeInfo/GET_STORE_INFO_SUCCESS', response.data)
        return Promise.all([
          StoreFocusList({ commit }, {id: response.data.id})
        ])
      }, err => {
        commit('storeInfo/GET_STORE_INFO_FAILURE', err)
      })
  },
  findCommodityOnBatchInfo ({ commit }, params = {}) {
    commit('storeInfo/REQUEST_COMMODITY')
    return axios.get(`/api/commodity/${params.batchCode || ''}/detail`)
      .then(response => {
        commit('storeInfo/GET_COMMODITY_SUCCESS', response.data)
        let commodity = response.data || {}
        commit('storeInfo/REQUEST_COMPONENT')
        return axios.get(`/api/commodity/component/${commodity.uuid}`)
          .then(response => {
            commit('storeInfo/GET_COMPONENT_SUCCESS', response.data)
            return Promise.all([
              findStoreInfoFromUuid({ commit }, {uuid: commodity.storeid})
            ])
          }, err => {
            commit('storeInfo/GET_COMPONENT_FAILURE', err)
          })
      }, err => {
        commit('storeInfo/GET_COMMODITY_FAILURE', err)
      })
  },
  findRecommendProducts ({ commit }, params = {}) {
    params.condition = 'store_uuid'
    commit('recommend/REQUEST_PRODUCTS')
    return axios.get('/api/store/recommend/products', { params })
      .then(response => {
        commit('recommend/GET_PRODUCTS_SUCCESS', response.data ? JSON.parse(JSON.stringify(response.data)) : [])
      }, err => {
        commit('recommend/GET_PRODUCTS_FAILURE', err)
      })
  },
  pageCommoditiesOfStore ({ commit }, uuid = '', pageParams = { page: 1, count: 6 }, code) {
    let params = { storeid: uuid, origin: 'store', code: code }
    params.page = pageParams.page
    params.count = pageParams.count
    commit('storeInfo/REQUEST_STORE_COMMODITY')
    return axios.get('/api/commodity/commodities', { params })
      .then(response => {
        commit('storeInfo/GET_STORE_COMMODITY_SUCCESS', response.data)
      }, err => {
        commit('storeInfo/GET_STORE_COMMODITY_FAILURE', err)
      })
  },
  mobilePageCommoditiesOfStore ({ commit }, params = {}) {
    commit('storeInfo/REQUEST_STORE_COMMODITY')
    return axios.get('/api/commodity/commodities', { params })
      .then(response => {
        commit('storeInfo/GET_STORE_COMMODITY_SUCCESS', response.data)
      }, err => {
        commit('storeInfo/GET_STORE_COMMODITY_FAILURE', err)
      })
  },
  // 获取保存浏览记录
  saveHistory ({ commit }, params = {}) {
    commit('storeInfo/REQUEST_SAVEHISOTRY')
    return axios.post(`/trade/history/goods/save?batchCode=${params.id}`, {})
      .then(response => {
        commit('storeInfo/GET_SAVEHISOTRY_SUCCESS', response.data)
      }, err => {
        commit('storeInfo/GET_SAVEHISOTRY_FAILURE', err)
      })
  },
  // 载入历史记录
  StoreFocusList ({ commit }, params = {}) {
    commit('storeInfo/REQUEST_FOCUSLIST')
    return axios.get(`/trade/storeFocus/ifFocus?storeid=${params.id}`)
      .then(response => {
        console.log(response.data)
        commit('storeInfo/GET_FOCUSLIST_SUCCESS', response.data)
      }, err => {
        commit('storeInfo/GET_FOCUSLIST_FAILURE', err)
      })
  },
  StoreFocus ({ commit }, storeName) {
    commit('storeInfo/REQUEST_FOCUS')
    return axios.post(`/trade/storeFocus/save`, storeName)
      .then(response => {
        commit('storeInfo/GET_FOCUS_SUCCESS', response.data)
        if (response.data === 'success') {
          commit('storeInfo/GET_FOCUSLIST_SUCCESS', 'true')
        }
      }, err => {
        commit('storeInfo/GET_FOCUS_FAILURE', err)
      })
  },
  // 根据UUID获取收藏店铺信息
  StoreFocusPage ({commit}, params = {}) {
    commit('storeInfo/REQUEST_FOCUSPAGE')
    return axios.get(`/trade/storeFocus/page`, {params})
      .then(response => {
        commit('storeInfo/GET_FOCUSPAGE_SUCCESS', response.data)
      }, err => {
        commit('storeInfo/GET_FOCUSPAGE_FAILURE', err)
      })
  }
}
