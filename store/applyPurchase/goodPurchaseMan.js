export const state = () => ({
  goodPurchaseMan: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_GOODPURCHASE (state) {
    state.goodPurchaseMan.fetching = true
  },
  GET_GOODPURCHASE_FAILURE (state) {
    state.goodPurchaseMan.fetching = false
  },
  GET_GOODPURCHASE_SUCCESS (state, result) {
    state.goodPurchaseMan.fetching = false
    state.goodPurchaseMan.data = result
  }
}

