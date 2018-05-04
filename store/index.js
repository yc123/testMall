import axios from '~plugins/axios'

// 获取品牌详情产品分类信息
function loadBrandCategories({ commit }, params = {}) {
  let id = params.id
  commit('brandCategories/REQUEST_CATEGORIES', params)
  return axios.get(`/api/product/brand/${id}/kinds`)
    .then(response => {
      commit('brandCategories/GET_CATEGORIES_SUCCESS', response.data)
    }, err => {
      commit('brandCategories/GET_CATEGORIES_FAILURE', err)
    })
}

// 获取品牌详情型号列表数据
function loadBrandComponent({ commit }, params = {}) {
  commit('brandComponent/REQUEST_COMPONENT', params)
  return axios.get('/api/product/component/list', { params })
    .then(response => {
      commit('brandComponent/GET_COMPONENT_SUCCESS', response.data)
    }, err => {
      commit('brandComponent/GET_COMPONENT_FAILURE', err)
    })
}

export const actions = {
  // 全局服务初始化
  nuxtServerInit(store, { params, route, isDev, isServer, req }) {
    // 检查设备类型
    const userAgent = isServer ? req.headers['user-agent'] : navigator.userAgent
    const isMobile = /(iPhone|iPad|Opera Mini|Android.*Mobile|NetFront|PSP|BlackBerry|Windows Phone)/ig.test(userAgent)
    const cookie = isServer ? req.headers['cookie'] : null
    store.commit('option/SET_MOBILE_LAYOUT', isMobile)
    store.commit('option/SET_USER_AGENT', userAgent)
    store.commit('option/SET_COOKIES', cookie)
    if (cookie) {
      if (cookie && cookie.length) {
        for (let i = 0; i < cookie.length; i++) {
          if (cookie[i].indexOf('JSESSIONID') > -1) {
            const sessionId = cookie[i]
            const first = sessionId.indexOf(';')
            const second = sessionId.lastIndexOf(';')
            const newSessionId = sessionId.replace(sessionId.substring(first, second), '')
            store.commit('option/SET_SESSION_ID', newSessionId)
            break
          }
        }
      }
      axios.defaults.headers['cookie'] = store.state.option.cookies + '; ' + store.state.option.sessionId
      axios.defaults.headers['User-Agent'] = store.state.option.userAgent
    }
    // 设置跳转的URL
    if (!isDev) {
      store.commit('option/UPDATE_URL', 'http://www.usoftmall.com')
    }
    return Promise.all([
      // 全局数据
      store.dispatch('loadUserInfo'),
      store.dispatch('loadProductCounts', { _status: 'actived' }),
      store.dispatch('loadHotSearchDevice'),
      store.dispatch('loadHotSearchBrand'),
      store.dispatch('loadNewFloors')
    ])
  },
  // 获取用户信息
  loadUserInfo({ commit }) {
    commit('option/REQUEST_USER_INFO')
    return axios.get('/user/authentication')
      .then(response => {
        if (response.data.userName) {
          let ens = response.data.enterprises
          if (ens && ens.length) {
            response.data.enterprise = ens.find(item => item.current) || { enName: '个人账户' }
          } else {
            response.data.enterprise = { enName: '个人账户' }
          }
        }
        commit('option/REQUEST_USER_INFO_SUCCESS', response.data)
      }, err => {
        commit('option/REQUEST_USER_INFO_FAILURE', err)
      })
  },
  // 用户退出
  logout({ commit }) {
    return axios.get('/logout')
      .then(response => {
        commit('option/REQUEST_LOGOUT_SUCCESS', response.data)
      })
  },
  // 获取楼层配置
  loadFloors({ commit }) {
    commit('floor/REQUEST_LIST')
    return axios.get('/api/floors/home')
      .then(response => {
        commit('floor/GET_LIST_SUCCESS', response.data)
      }, err => {
        commit('floor/GET_LIST_FAILURE', err)
      })
  },
  // 批量获取产品信息
  loadBatchCommodities({ commit }, params = {}) {
    commit('floor/REQUEST_EXPANDLIST')
    return axios.post('/api/commodity/detail', params.batchCodeList)
      .then(response => {
        commit('floor/GET_EXPANDLIST_SUCCESS', response.data)
      }, err => {
        commit('floor/GET_EXPANDLIST_FAILURE', err)
      })
  },
  // 获取轮播配置
  loadBanners({ commit }, params = {}) {
    commit('carousel/REQUEST_BANNER')
    return axios.get('/api/carousel/' + params.type + '%20' + (params.type === 'home' ? 'page' : 'zone') + '%20banner')
      .then(response => {
        commit('carousel/GET_BANNER_SUCCESS', response.data)
      }, err => {
        commit('carousel/GET_BANNER_FAILURE', err)
      })
  },
  // 获取新楼层配置
  loadNewFloors({ commit }) {
    commit('floor/REQUEST_NEWLIST')
    return axios.get('/api/floors/home-v3')
      .then(response => {
        commit('floor/GET_NEWLIST_SUCCESS', response.data)
      }, err => {
        commit('floor/GET_NEWLIST_FAILURE', err)
      })
  },
  // 获取子器件类目
  loadProductKinds({ commit }, params = {}) {
    let id = params.id
    commit('product/kind/REQUEST_KIND', params)
    return axios.get(`/api/product/kind/${id}/children`)
      .then(response => {
        commit('product/kind/GET_KIND_SUCCESS', { id, result: response.data })
      }, err => {
        commit('product/kind/GET_KIND_FAILURE', { id, err })
      })
  },
  // 获取全部子器件类目
  loadAllProductKinds({ commit }, params = {}) {
    let id = params.id
    commit('product/kind/REQUEST_KIND', params)
    return axios.get(`/api/product/kind/${id}/children_all`)
      .then(response => {
        commit('product/kind/GET_KIND_SUCCESS', { id, result: response.data })
      }, err => {
        commit('product/kind/GET_KIND_FAILURE', { id, err })
      })
  },
  // 获取首页新闻
  loadNewsSnapshot({ commit }, params = {}) {
    commit('news/REQUEST_SNAPSHOT')
    return axios.get('/api/news/created', { params })
      .then(response => {
        commit('news/GET_SNAPSHOT_SUCCESS', response.data)
      }, err => {
        commit('news/GET_SNAPSHOT_FAILURE', err)
      })
  },
  // 获取器件统计信息
  loadProductCounts({ commit }, params = {}) {
    commit('product/common/REQUEST_COUNTS')
    return axios.get('/api/product/commoncount', { params })
      .then(response => {
        commit('product/common/GET_COUNTS_SUCCESS', response.data)
      }, err => {
        commit('product/common/GET_COUNTS_FAILURE', err)
      })
  },
  // 搜索关键字
  searchKeywords({ commit }, params = {}) {
    commit('search/REQUEST_KEYWORDS')
    return axios.get('/search/similarKeywords', { params })
      .then(response => {
        commit('search/GET_KEYWORDS_SUCCESS', response.data)
      }, err => {
        commit('search/GET_KEYWORDS_FAILURE', err)
      })
  },
  resetSearchKeywords({ commit }) {
    commit('search/RESET_KEYWORDS')
  },
  // 热卖推荐页面
  loadProductHot({ commit }, params = {}) {
    commit('original/REQUEST_HOT')
    return axios.get('/api/commodity/latest', { params })
      .then(response => {
        commit('original/GET_HOT_SUCCESS', response.data)
      }, err => {
        commit('original/GET_HOT_FAILURE', err)
      })
  },
  // 器件详情页面
  // 获得器件详情信息
  loadComponentDetail({ commit }, params = {}) {
    let id = params.id
    commit('componentDetail/REQUEST_DETAIL', params)
    return axios.get(`/api/product/component/${id}`)
      .then(response => {
        commit('componentDetail/GET_DETAIL_SUCCESS', response.data)
        if (response.data) {
          commit('componentMenu/REQUEST_MENU', params)
          return axios.get(`/api/product/kind/structing/${response.data.kindid}`)
            .then(response => {
              commit('componentMenu/GET_MENU_SUCCESS', response.data)
            }, err => {
              commit('componentMenu/GET_MENU_FAILURE', err)
            })
        }
      }, err => {
        commit('componentDetail/GET_DETAIL_FAILURE', err)
      })
  },
  // 获取器件详情页面包屑导航
  loadComponentMenu({ commit }, params = {}) {
    let pid = params.id
    commit('componentMenu/REQUEST_MENU', params)
    return axios.get(`/api/product/kind/structing/${pid}`)
      .then(response => {
        commit('componentMenu/GET_MENU_SUCCESS', response.data)
      }, err => {
        commit('componentMenu/GET_MENU_FAILURE', err)
      })
  },
  // 器件详情页选择商家
  loadComponentStore({ commit }, params = {}) {
    let id = params.uuid
    commit('componentStore/REQUEST_STORE', params)
    return axios.get(`/api/store-service/stores/uuid/${id}`)
      .then(response => {
        commit('componentStore/GET_STORE_SUCCESS', response.data)
      }, err => {
        commit('componentStore/GET_STORE_FAILURE', err)
      })
  },
  // 器件详情页商家列表
  loadComponentInformation({ commit }, params = {}) {
    // let params = {}
    // let filter = {uuid: uuid.uuid, ignoreUMall: false, ignoreStore: false}
    // // let sorting = {minPriceRMB: 'ASC'}
    // params.filter = filter
    // // params.sorting = sorting
    // params.page = pageParams.page
    // params.count = pageParams.count
    commit('componentInformation/REQUEST_INFORMATION')
    return axios.get('/api/commodity/goods/page', { params })
      .then(response => {
        commit('componentInformation/GET_INFORMATION_SUCCESS', response.data)
      }, err => {
        commit('componentInformation/GET_INFORMATION_FAILURE', err)
      })
  },
  // 获取库存寄售店铺storeid
  getUmallStoreId({ commit }) {
    commit('componentUmallStoreId/REQUEST_STOREID')
    return axios.get('/api/store-service/stores/UmallStore')
      .then(response => {
        commit('componentUmallStoreId/GET_STOREID_SUCCESS', response.data)
      }, err => {
        commit('componentUmallStoreId/GET_STOREID_FAILURE', err)
      })
  },
  // 品牌详情页面
  // 获得品牌详情信息
  loadBrandDetail({ commit, dispatch }, params = {}) {
    let id = params.id
    commit('brandDetail/REQUEST_DETAIL', params)
    return axios.get(`/api/product/brand/${id}`)
      .then(response => {
        let brand = response.data || {}
        commit('brandDetail/GET_DETAIL_SUCCESS', response.data)
        return Promise.all([
          loadBrandCategories({ commit }, { id: brand.id }),
          loadBrandComponent({ commit }, { count: 10, filter: { brandid: brand.id }, page: 1 })
        ])
      }, err => {
        commit('brandDetail/GET_DETAIL_FAILURE', err)
      })
  },
  // 获取品牌详情产品分类信息
  loadBrandCategories({ commit }, params = {}) {
    let id = params.id
    commit('brandCategories/REQUEST_CATEGORIES', params)
    return axios.get(`/api/product/brand/${id}/kinds`)
      .then(response => {
        commit('brandCategories/GET_CATEGORIES_SUCCESS', response.data)
      }, err => {
        commit('brandCategories/GET_CATEGORIES_FAILURE', err)
      })
  },
  // 获取品牌详情型号列表数据
  loadBrandComponent({ commit }, params = {}) {
    commit('brandComponent/REQUEST_COMPONENT', params)
    return axios.get('/api/product/component/list', { params })
      .then(response => {
        commit('brandComponent/GET_COMPONENT_SUCCESS', response.data)
      }, err => {
        commit('brandComponent/GET_COMPONENT_FAILURE', err)
      })
  },
  // 获取品牌详情分页信息
  loadBrandPages({ commit }, params = {}) {
    commit('brandPages/REQUEST_PAGES', params)
    return axios.get('/api/product/PAGES/list', { params })
      .then(response => {
        commit('brandPages/GET__SUCCESS', response.data)
      }, err => {
        commit('brandPages/GET_COMPONENT_FAILURE', err)
      })
  },
  // 留言板
  // 提交了留言板信息
  uploadMessageBoardInformation({ commit }, params) {
    commit('messageBoard/REQUEST_INFORMATION')
    return axios.post('/api/operation/messageBoard', params)
      .then(response => {
        commit('messageBoard/GET_INFORMATION_SUCCESS', response.data)
      }, err => {
        commit('messageBoard/GET_INFORMATION_FAILURE', err)
      })
  },
  // 验证用户是否登录
  userIsLogin({ commit }) {
    commit('messageBoardIsLogin/REQUEST_LOGIN')
    return axios.get('/user/authentication')
      .then(response => {
        commit('messageBoardIsLogin/GET_LOGIN_SUCCESS', response.data)
      }, err => {
        commit('messageBoardIsLogin/GET_LOGIN_FAILURE', err)
      })
  },
  // 获取留言记录信息
  getMessageBoardInformation({ commit }, params) {
    let sorting = { createDate: 'DESC' }
    params.sorting = sorting
    commit('messageBoardInformation/REQUEST_INFORMATION', params)
    return axios.get('/operation/messageBoard/pageInfo/user', { params })
      .then(response => {
        commit('messageBoardInformation/GET_INFORMATION_SUCCESS', response.data)
      }, err => {
        commit('messageBoardInformation/GET_INFORMATION_FAILURE', err)
      })
  },
  // 获取帮助中心信息
  loadHelpSnapsho({ commit }, params = {}) {
    commit('help/REQUEST_SNAPSHO')
    return axios.get('/api/help-service/helps', { params })
      .then(response => {
        commit('help/GET_SNAPSHO_SUCCESS', response.data)
      }, err => {
        commit('help/GET_SNAPSHO_FAILURE', err)
      })
  },
  // 获取帮助中心二级菜单
  loadHelpList({ commit }, params = {}) {
    commit('help/REQUEST_HELPLIST')
    return axios.get('/api/help-service/issues', { params })
      .then(response => {
        commit('help/GET_HELPLIST_SUCCESS', response.data)
      }, err => {
        commit('help/GET_HELPLIST_FAILURE', err)
      })
  },
  // 获取帮助中心名称
  loadHelpTitle({ commit }, params = {}) {
    let id = params.id
    commit('help/REQUEST_TITLE')
    return axios.get(`/api/help-service/${id}`, { params })
      .then(response => {
        commit('help/GET_TITLE_SUCCESS', response.data)
      }, err => {
        commit('help/GET_TITLE_FAILURE', err)
      })
  },
  // 获取详情
  loadHelpDetail({ commit }, params = {}) {
    let id = params.id
    commit('help/REQUEST_DETAIL')
    return axios.get(`/api/help-service/issues/${id}`, { params })
      .then(response => {
        commit('help/GET_DETAIL_SUCCESS', response.data)
        let id = response.data.navId
        commit('help/REQUEST_TITLE')
        return axios.get(`/api/help-service/${id}`)
          .then(response => {
            commit('help/GET_TITLE_SUCCESS', response.data)
          }, err => {
            commit('help/GET_TITLE_FAILURE', err)
          })
      }, err => {
        commit('help/GET_DETAIL_FAILURE', err)
      })
  },

  // 获取最多搜索量的 器件
  loadHotSearchDevice({ commit }) {
    commit('hotSearchDevice/REQUEST_HOT')
    return axios.get('/api/product/component/mostSearchComponent')
      .then(response => {
        commit('hotSearchDevice/GET_HOT_SUCCESS', response.data)
      }, err => {
        commit('hotSearchDevice/GET_HOT_FAILURE', err)
      })
  },
  // 获取最多搜索量的 品牌
  loadHotSearchBrand({ commit }) {
    commit('hotSearchBrand/REQUEST_HOT')
    return axios.get('/api/product/brand/mostSearchBrands')
      .then(response => {
        commit('hotSearchBrand/GET_HOT_SUCCESS', response.data)
      }, err => {
        commit('hotSearchBrand/GET_HOT_FAILURE', err)
      })
  },
  // 获取用户开店信息
  loadStoreStatus({ commit }, params = {}) {
    commit('option/REQUEST_STORE_STATUS')
    return axios.get('/store-service/stores', { params: params })
      .then(response => {
        commit('option/REQUEST_STORE_STATUS_SUCCESS', response.data)
      }, err => {
        commit('option/REQUEST_STORE_STATUS_FAILURE', err)
      })
  }
}

