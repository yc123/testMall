import axios from '~plugins/axios'

// let findStoreInfoFromUuid = function ({ commit }, params = {}) {
//   let str = ''
//   let list = params.list
//   for (let i = 0; i < list.content.length; i++) {
//     str += list.content[i].id
//     str += i !== list.content.length - 1 ? ',' : ''
//   }
//   return axios.get('/seek/offer/getSeekPurchaseOfferList', {params: {spIds: str}}).then(response => {
//     for (let i = 0; i < list.content.length; i++) {
//       if (response.data.length) {
//         for (let j = 0; j < response.data.length; j++) {
//           list.content[i].isOffer = list.content[i].id === response.data[j].spId
//           if (list.content[i].isOffer) {
//             break
//           }
//         }
//       } else {
//         list.content[i].isOffer = false
//       }
//     }
//     commit('purchaseManList/GET_PURCHASEMAN_SUCCESS', list)
//   }, err => {
//     console.log(err)
//     commit('purchaseManList/GET_PURCHASEMAN_SUCCESS', list)
//   })
// }

// 获取商城现货
let getSpotGoods = function ({commit}, params = {}) {
  return axios.get('/seek/getMallGoodsList', {params: {brand: params.brand, code: params.code}})
    .then(response => {
      params.spotGoods = response.data
      // commit('bomMaterial/ADD_BOM_MATERIAL_BY_SPOT_GOODS', params)
    }, err => {
      console.log(err)
    })
}

export const actions = {
  // 获取手机端首页求购数据
  loadMobileHomeList ({ commit }, params = {}) {
    commit('purchaseManList/REQUEST_MOBILE_HOME_SEEK')
    return axios.get('/inquiry/public', {params})
      .then(response => {
        commit('purchaseManList/GET_MOBILE_HOME_SEEK_SUCCESS', response.data)
      }, err => {
        commit('purchaseManList/GET_MOBILE_HOME_SEEK_FAILURE', err)
      })
  },
// 采购商列表
  loadPurchaseManList ({ commit }, params = {}) {
    commit('purchaseManList/REQUEST_PURCHASEMAN')
    return axios.get('/inquiry/public', {params})
      .then(response => {
        let list = response.data
        for (let i = 0; i < list.content.length; i++) {
          list.content[i].active = false
        }
        // return Promise.all([
        //   findStoreInfoFromUuid({ commit }, {list: list})
        // ])
        commit('purchaseManList/GET_PURCHASEMAN_SUCCESS', list)
      }, err => {
        commit('purchaseManList/GET_PURCHASEMAN_FAILURE', err)
      })
  },
  loadPurchaseManDetail ({ commit }, params = {}) {
    commit('purchaseManList/REQUEST_PURCHASEMAN_DETAIL')
    return axios.get('/inquiry/public/findItemByItemId', {params})
      .then(response => {
        commit('purchaseManList/GET_PURCHASEMAN_DETAIL_SUCCESS', response.data)
      }, err => {
        commit('purchaseManList/GET_PURCHASEMAN_DETAIL_FAILURE', err)
      })
  },
  /* 获取卖家报价信息 */
  loadVendorInquiryDetail ({ commit }, params = {}) {
    commit('purchaseManList/REQUEST_VENDOR_INQUIRY_DETAIL')
    return axios.get('/inquiry/public/quotation/one', {params})
      .then(response => {
        commit('purchaseManList/GET_VENDOR_INQUIRY_DETAIL_SUCCESS', response.data)
      }, err => {
        commit('purchaseManList/GET_VENDOR_INQUIRY_DETAIL_FAILURE', err)
      })
  },
  /* 获取买家报价信息 */
  loadBuyerInquiryDetail ({ commit }, params = {}) {
    commit('purchaseManList/REQUEST_BUYER_INQUIRY_DETAIL')
    return axios.get('/inquiry/buyer/quotation', {params})
      .then(response => {
        commit('purchaseManList/GET_BUYER_INQUIRY_DETAIL_SUCCESS', response.data)
      }, err => {
        commit('purchaseManList/GET_BUYER_INQUIRY_DETAIL_FAILURE', err)
      })
  },
  loadBuyerPurchaseManList ({ commit }, params = {}) {
    commit('purchaseManList/REQUEST_PURCHASEMAN')
    return axios.get('/inquiry/buyer/quotations', {params})
      .then(response => {
        commit('purchaseManList/GET_PURCHASEMAN_SUCCESS', response.data)
      }, err => {
        commit('purchaseManList/GET_PURCHASEMAN_FAILURE', err)
      })
  },
  loadBuyerUnSayPricePurchaseManList ({ commit }, params = {}) {
    commit('purchaseManList/REQUEST_PURCHASEMAN')
    return axios.get('/inquiry/buyer/list', {params})
      .then(response => {
        commit('purchaseManList/GET_PURCHASEMAN_SUCCESS', response.data)
      }, err => {
        commit('purchaseManList/GET_PURCHASEMAN_FAILURE', err)
      })
  },
  loadVendorPurchaseManList ({ commit }, params = {}) {
    commit('purchaseManList/REQUEST_PURCHASEMAN')
    return axios.get('/inquiry/public/quotation/list', {params})
      .then(response => {
        commit('purchaseManList/GET_PURCHASEMAN_SUCCESS', response.data)
      }, err => {
        commit('purchaseManList/GET_PURCHASEMAN_FAILURE', err)
      })
  },
  // 卖家精准推送求购列表
  loadVendorPushList ({ commit }, params = {}) {
    commit('purchaseManList/REQUEST_PURCHASEMAN')
    return axios.get('/inquiry/sale/remind', {params})
      .then(response => {
        commit('purchaseManList/GET_PURCHASEMAN_SUCCESS', response.data)
      }, err => {
        commit('purchaseManList/GET_PURCHASEMAN_FAILURE', err)
      })
  },
  // 求购排行榜
  loadPurchaseApplyRank ({ commit }, params = {}) {
    commit('purchaseApplyRank/REQUEST_PURCHASERANK', params)
    return axios.get(`/inquiry/public/findCodeRankingList`)
      .then(response => {
        commit('purchaseApplyRank/GET_PURCHASERANK_SUCCESS', response.data)
      }, err => {
        commit('purchaseApplyRank/GET_PURCHASERANK_FAILURE', err)
      })
  },
  // 优质采购商列表
  loadGoodPurchaseManList ({ commit }, params = {}) {
    commit('goodPurchaseMan/REQUEST_GOODPURCHASE')
    return axios.get('/seek/qualityBuyer/getBuyerPageInfo', params)
      .then(response => {
        commit('goodPurchaseMan/GET_GOODPURCHASE_SUCCESS', response.data)
      }, err => {
        commit('goodPurchaseMan/GET_GOODPURCHASE_FAILURE', err)
      })
  },
  // 获取BOM物料列表
  loadBOMMaterialList ({ commit }, params = {}) {
    commit('bomMaterial/REQUEST_BOM_MATERIAL')
    return axios.get('/seek/getSeekPurchaseByBatchPageInfo', {params: params})
      .then(response => {
        let list = response.data.content
        if (list && list.length) {
          let promises = []
          for (let i = 0; i < list.length; i++) {
            list[i].$index = i
            promises.push(getSpotGoods({commit}, list[i]))
          }
          return Promise.all(promises).then(() => {
            commit('bomMaterial/GET_BOM_MATERIAL_SUCCESS', response.data)
          })
        }
        commit('bomMaterial/GET_BOM_MATERIAL_SUCCESS', response.data)
      }, err => {
        commit('bomMaterial/GET_BOM_MATERIAL_FAILURE', err)
      })
  },
  // 获取BOM上传情况
  loadBOMNumber ({ commit }, params = {}) {
    commit('bomMaterial/REQUEST_BOM_INFO')
    return axios.get('/seek/getImportBomInfo', {params: params})
      .then(response => {
        commit('bomMaterial/GET_BOM_INFO_SUCCESS', response.data)
      }, err => {
        commit('bomMaterial/GET_BOM_INFO_FAILURE', err)
      })
  }
}

