import axios from '~/plugins/axios'

export const actions = {
  // 获取浏览记录
  getSupplierList ({ commit }, params = {}) {
    commit('data/REQUEST_LIST')
    return axios.get('/vendor/introduction/vendor/list', {params})
      .then(response => {
        commit('data/GET_LIST_SUCCESS', response.data)
      }, err => {
        commit('data/GET_LIST_FAILURE', err)
      })
  },
  // 根据uu获取供应商企业信息
  getSupplierEnInfo ({ commit }, params = {}) {
    commit('data/REQUEST_EN')
    return axios.get(`/basic/enterprise/${params.uu}/info`, {params})
      .then(response => {
        commit('data/GET_EN_SUCCESS', response.data)
      }, err => {
        commit('data/GET_EN_FAILURE', err)
      })
  },
  // 获取供应商物料列表
  getSupplierProductList ({ commit }, params = {}) {
    commit('data/REQUEST_PRODUCT_LIST')
    return axios.get(`/vendor/introduction/product/list`, {params})
      .then(response => {
        commit('data/GET_PRODUCT_LIST_SUCCESS', response.data)
      }, err => {
        commit('data/GET_PRODUCT_LIST_FAILURE', err)
      })
  },
  // 获取供应商展示列表
  loadVendorList ({commit}, params) {
    commit('merchant/REQUEST_MERCHANT')
    return axios.get('/vendor/introduction/vendor/list', {params})
      .then(res => {
        commit('merchant/GET_MERCHANT_SUCCESS', res.data)
      }, (err) => {
        commit('merchant/GET_MERCHANT_FAILURE', err)
      })
  },
  // 获取供应商展示列表总数
  loadVendorAll ({commit}, params) {
    commit('merchant/REQUEST_MERCHANTALL')
    return axios.get('/vendor/introduction/vendor/list', {params})
      .then(res => {
        commit('merchant/GET_MERCHANTALL_SUCCESS', res.data)
      }, (err) => {
        commit('merchant/GET_MERCHANTALL_FAILURE', err)
      })
  },
  // 获取供应商物料列表
  loadMaterialList ({commit}, params = {}) {
    commit('material/REQUEST_MATERIAL')
    return axios.get('/vendor/introduction/product/list', {params})
      .then(res => {
        commit('material/GET_MATERIAL_SUCCESS', res.data)
      }, (err) => {
        commit('material/GET_MATERIAL_FAILURE', err)
      })
  },
  // 获取获取物料详细信息
  loadMaterialDetail ({commit}, params = {}) {
    commit('detail/REQUEST_DETAIL')
    return axios.get('/vendor/introduction/product/detail', {params})
      .then(res => {
        commit('detail/GET_DETAIL_SUCCESS', res.data)
        if (res.data.cmpUuId) {
          commit('detail/REQUEST_CMPINFO')
          return axios.get(`/api/commodity/component/${res.data.cmpUuId}`)
            .then(res => {
              commit('detail/GET_CMPINFO_SUCCESS', res.data)
            }, (err) => {
              commit('detail/GET_CMPINFO_FAILURE', err)
            })
        }
      }, (err) => {
        commit('detail/GET_DETAIL_FAILURE', err)
      })
  },
  // 获取企业信息
  loadEnUser ({commit}, params = {}) {
    commit('material/REQUEST_ENUSER')
    return axios.get(`/basic/enterprise/${params.enUU}/info`)
      .then(res => {
        commit('material/GET_ENUSER_SUCCESS', res.data)
      }, (err) => {
        commit('material/GET_ENUSER_FAILURE', err)
      })
  }
}
