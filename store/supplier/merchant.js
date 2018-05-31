export const state = () => ({
  merchant: {
    fetching: false,
    data: []
  },
  merchantAll: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_MERCHANT (state) {
    state.merchant.detching = true
  },
  GET_MERCHANT_SUCCESS (state, result) {
    state.merchant.fetching = false
    state.merchant.data = result
  },
  GET_MERCHANT_FAILURE (state) {
    state.merchant.fetching = false
  },
  REQUEST_MERCHANTALL (state) {
    state.merchantAll.fetching = true
  },
  GET_MERCHANTALL_SUCCESS (state, result) {
    state.merchantAll.fetching = false
    state.merchantAll.data = result
  },
  GET_MERCHANTALL_FAILURE (state) {
    state.merchantAll.fetching = false
  }
}
