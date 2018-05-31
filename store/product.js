import axios from '~/plugins/axios'

// 保存一列收藏记录, 此方法仅限于在登陆界面使用
function saveStores ({ commit }, params = {}) {
  commit('common/REQUEST_COLLECTLIST')
  return axios.get(`/trade/collection/list`, { params })
    .then(response => {
      commit('common/GET_COLLECTLIST_SUCCESS', response.data)
    }, err => {
      commit('common/GET_COLLECTLIST_FAILURE', err)
    })
}

export const actions = {
  // 全局服务初始化
  nuxtServerInit (store, { params, route, isServer, req }) {
    // 检查设备类型
    const userAgent = isServer ? req.headers['user-agent'] : navigator.userAgent
    const isMobile = /(iPhone|iPod|Opera Mini|Android.*Mobile|NetFront|PSP|BlackBerry|Windows Phone)/ig.test(userAgent)
    store.commit('option/SET_MOBILE_LAYOUT', isMobile)
    store.commit('option/SET_USER_AGENT', userAgent)
    return Promise.all([
      // 全局数据
      // store.dispatch('loadUserInfo')
    ])
  },
  // 品牌列表推荐品牌配置
  loadRecommends ({ commit }) {
    commit('brand/REQUEST_RECOMMENDS')
    return axios.get(`/api/product/brand/hot/5`)
      .then(response => {
        commit('brand/GET_RECOMMENDS_SUCCESS', response.data)
      }, err => {
        commit('brand/GET_RECOMMENDS_FAILURE', err)
      })
  },
  // 品牌列表配置
  loadBrands ({ commit }, params = {}) {
    let keyword = params.keyword
    commit('brand/REQUEST_BRANDS', params)
    return axios.get(`/api/product/brand/initial/${keyword}`)
      .then(response => {
        commit('brand/GET_BRANDS_SUCCESS', response.data)
      }, err => {
        commit('brand/GET_BRANDS_FAILURE', err)
      })
  },
  // 品牌列表分页查询
  loadBrandsPager ({ commit }, params = {}) {
    // let initial = params.initial
    // let param = {
    //   page: params.page || 1,
    //   count: params.count || 30,
    //   keyword: params.keyword
    // }
    commit('brand/REQUEST_BRANDS_PAGER', params)
    return axios.get(`/api/product/brand/page/initial`, {params: params})
      .then(response => {
        commit('brand/GET_BRANDS_PAGER_SUCCESS', response.data)
      }, err => {
        commit('brand/GET_BRANDS_PAGER_FAILURE', err)
      })
  },
  // 获取全部子器件类目
  loadAllProductKinds ({ commit }, params = {}) {
    let id = params.id
    commit('kind/REQUEST_KIND', params)
    return axios.get(`/api/product/kind/${id}/children_all`)
      .then(response => {
        commit('kind/GET_KIND_SUCCESS', { id, result: response.data })
      }, err => {
        commit('kind/GET_KIND_FAILURE', {id, err})
      })
  },
  loadKindParentsWithBothers ({ commit }, params = {}) {
    let id = params.id
    commit('kind/REQUEST_KINDPARENTSWITHBOTHERS', params)
    return axios.get(`/api/product/kind/${id}/parentsWithBothers`)
      .then(response => {
        commit('kind/GET_KINDPARENTSWITHBOTHERS_SUCCESS', response.data)
        // if (response.data) {
        //   if (!response.data[response.data.length - 1].leaf) {
        //     // commit('kind/REQUEST_CHILDREN')
        //     // return axios.get(`/api/product/kind/${id}/children`)
        //     //   .then(response => {
        //     //     commit('kind/GET_CHILDREN_SUCCESS', response.data)
        //     //   }, err => {
        //     //     commit('kind/GET_CHILDREN_FAILURE', err)
        //     //   })
        //   } else {
        //     // commit('kind/REQUEST_KINDPROPERTY')
        //     // return axios.get(`/api/product/kind/${id}/properties/values`)
        //     //   .then(response => {
        //     //     commit('kind/GET_KINDPROPERTY_SUCCESS', response.data)
        //     //   }, err => {
        //     //     commit('kind/GET_KINDPROPERTY_FAILURE', err)
        //     //   })
        //   }
        // }
      }, err => {
        commit('kind/GET_KINDPARENTSWITHBOTHERS_FAILURE', err)
      })
  },
  loadKindBrands ({ commit }, params = {}) {
    let id = params.id
    commit('kind/REQUEST_KINDBRANDS')
    return axios.get(`/api/product/kind/${id}/brands`)
      .then(response => {
        commit('kind/GET_KINDBRANDS_SUCCESS', response.data)
      }, err => {
        commit('kind/GET_KINDBRANDS_FAILURE', err)
      })
  },
  pageComGoods ({ commit }, kindid = '', brandid = '', pageParams = { page: 1, count: 10 }) {
    let params = {}
    let filter = {kindid: kindid.kindid, brandid: kindid.brandid, properties: kindid.properties}
    params.filter = filter
    params.page = pageParams.page
    params.count = pageParams.count
    commit('component/REQUEST_CMPGOODS')
    return axios.get('/api/product/product/getCompGoodsByKindid', { params })
      .then(response => {
        commit('component/GET_CMPGOODS_SUCCESS', response.data)
      }, err => {
        commit('component/GET_CMPGOODS_FAILURE', err)
      })
  },
  // 保存单个收藏记录
  saveEntity ({ commit }, componentid) {
    commit('common/REQUEST_COLLECTSAVA')
    return axios.post(`/trade/collection/save`, componentid)
      .then(response => {
        commit('common/GET_COLLECTSAVA_SUCCESS', response.data)
        if (response.data === 'success') {
          commit('common/GET_COLLECTLIST_SUCCESS')
          return Promise.all([
            saveStores({ commit })
          ])
        }
      }, err => {
        commit('common/GET_COLLECTSAVA_FAILURE', err)
      })
  },
  // 保存一列收藏记录, 此方法仅限于在登陆界面使用
  saveStores ({ commit }, params = {}) {
    commit('common/REQUEST_COLLECTLIST')
    return axios.get(`/trade/collection/list`, { params })
      .then(response => {
        commit('common/GET_COLLECTLIST_SUCCESS', response.data)
      }, err => {
        commit('common/GET_COLLECTLIST_FAILURE', err)
      })
  },
  // 供应商维护
  loadSupplierInformation ({ commit }, params = {}) {
    let uuid = params.uuid
    let param = {
      page: params.page,
      count: params.count
    }
    commit('supplierInformation/REQUEST_INFORMATION')
    return axios.get(`/api/produce/vendorlist/${uuid}`, {params: param})
      .then(response => {
        commit('supplierInformation/GET_INFORMATION_SUCCESS', response.data)
      }, err => {
        commit('supplierInformation/GET_INFORMATION_FAILURE', err)
      })
  },
  // 获取用户器件收藏数据
  loadCompCollectInfo({ commit }) {
    commit('component/REQUEST_COLLECT')
    return axios.get('/trade/collection/count', { params: {type: 'component'} })
      .then(response => {
        commit('component/REQUEST_COLLECT_SUCCESS', response.data)
      }, err => {
        commit('component/REQUEST_COLLECT_FAILURE', err)
      })
  }
}
