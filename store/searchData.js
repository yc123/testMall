import axios from '~plugins/axios'

function reloadListData ({ commit }, listData) {
  axios.get('/trade/collection/list').then(response => {
    let focusData = response.data
    for (let i = 0; i < listData.components.length; i++) {
      for (let j = 0; j < focusData.length; j++) {
        listData.components[i].isFocus = listData.components[i].cmpId === focusData[j].componentid
        if (listData.components[i].isFocus) {
          break
        }
      }
    }
    commit('searchList/GET_LIST_SUCCESS', listData)
  }, err => {
    console.log(err)
    commit('searchList/GET_LIST_SUCCESS', listData)
  })
}
export const actions = {
  // 获取搜索kind
  searchForKinds ({ commit }, params = {}) {
    commit('searchKinds/REQUEST_KINDS', params)
    return axios.get(`/search/componentGoods/collect`, {params})
      .then(response => {
        commit('searchKinds/GET_KINDS_SUCCESS', response.data)
      }, err => {
        commit('searchKinds/GET_KINDS_FAILURE', err)
      })
  },
  // 获取搜索brand
  searchForBrands ({ commit }, params = {}) {
    commit('searchBrands/REQUEST_BRANDS', params)
    return axios.get(`/search/componentGoods/collect`, {params})
      .then(response => {
        commit('searchBrands/GET_BRANDS_SUCCESS', response.data)
      }, err => {
        commit('searchBrands/GET_BRANDS_FAILURE', err)
      })
  },
  // 获取命中详情
  searchForDetail ({ commit }, params = {}) {
    commit('searchDetail/REQUEST_DETAIL', params)
    return axios.get(`/search/componentGoods/collect`, {params})
      .then(response => {
        commit('searchDetail/GET_DETAIL_SUCCESS', response.data)
      }, err => {
        commit('searchDetail/GET_DETAIL_FAILURE', err)
      })
  },
  // 获取搜索list
  searchForList ({ commit }, params = {}) {
    commit('searchList/REQUEST_LIST', params)
    return axios.get(`/api/product/component/search/compGoods`, {params})
      .then(response => {
        commit('searchList/GET_LIST_SUCCESS', response.data)
        if (response.data.brands && response.data.brands.uuid) {
          commit('searchDetail/REQUEST_DETAIL', params)
          return axios.get(`/api/product/brand/${response.data.brands.uuid}`)
            .then(response => {
              commit('searchDetail/GET_DETAIL_SUCCESS', response.data)
            }, err => {
              commit('searchDetail/GET_DETAIL_FAILURE', err)
            })
        }
      }, err => {
        commit('searchList/GET_LIST_FAILURE', err)
      })
  },
  // 获取手机端搜索list
  searchForListInMobile ({ commit }, params = {}) {
    commit('searchList/REQUEST_LIST', params)
    return axios.get(`/api/product/component/search/compGoods`, {params})
      .then(response => {
        let listData = response.data
        if (response.data.brands && response.data.brands.uuid) {
          commit('searchDetail/REQUEST_DETAIL', params)
          return axios.get(`/api/product/brand/${response.data.brands.uuid}`)
            .then(response => {
              reloadListData({ commit }, listData)
              commit('searchDetail/GET_DETAIL_SUCCESS', response.data)
            }, err => {
              commit('searchDetail/GET_DETAIL_FAILURE', err)
            })
        } else {
          reloadListData({ commit }, listData)
        }
      }, err => {
        commit('searchList/GET_LIST_FAILURE', err)
      })
  },
  // 获取搜索货源
  searchForStoreType ({ commit }, params = {}) {
    commit('searchStoreType/REQUEST_STORETYPE', params)
    return axios.get(`/search/componentGoods/collect`, {params})
      .then(response => {
        commit('searchStoreType/GET_STORETYPE_SUCCESS', response.data)
      }, err => {
        commit('searchStoreType/GET_STORETYPE_FAILURE', err)
      })
  },
  // 获取搜索币种
  searchForCrname ({ commit }, params = {}) {
    commit('searchCrname/REQUEST_CRNAME', params)
    return axios.get(`/search/componentGoods/collect`, {params})
      .then(response => {
        commit('searchCrname/GET_CRNAME_SUCCESS', response.data)
      }, err => {
        commit('searchCrname/GET_CRNAME_FAILURE', err)
      })
  },
  // 获取搜索历史
  getSearchHistory ({ commit }, params = {}) {
    commit('searchHistory/REQUEST_SEARCH_HISTORY', params)
    return axios.get(`/search/searchHistory`, {params})
      .then(response => {
        commit('searchHistory/GET_SEARCH_HISTORY_SUCCESS', response.data)
      }, err => {
        commit('searchHistory/GET_SEARCH_HISTORY_FAILURE', err)
      })
  }
}

