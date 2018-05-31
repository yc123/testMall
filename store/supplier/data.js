export const state = () => ({
  list: {
    fetching: false,
    data: []
  },
  enterpriseData: {
    fetching: false,
    data: []
  },
  productList: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_LIST (state) {
    state.list.fetching = true
  },
  GET_LIST_FAILURE (state) {
    state.list.fetching = false
  },
  GET_LIST_SUCCESS (state, result = []) {
    state.list.fetching = false
    state.list.data = result
  },
  REQUEST_EN (state) {
    state.enterpriseData.fetching = true
  },
  GET_EN_FAILURE (state) {
    state.enterpriseData.fetching = false
  },
  GET_EN_SUCCESS (state, result = []) {
    state.enterpriseData.fetching = false
    state.enterpriseData.data = result
  },
  REQUEST_PRODUCT_LIST (state) {
    state.productList.fetching = true
  },
  GET_PRODUCT_LIST_FAILURE (state) {
    state.productList.fetching = false
  },
  GET_PRODUCT_LIST_SUCCESS (state, result = []) {
    state.productList.fetching = false
    state.productList.data = result
  }
}
