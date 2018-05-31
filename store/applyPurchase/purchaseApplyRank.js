export const state = () => ({
  purchaseApplyRank: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_PURCHASERANK (state) {
    state.purchaseApplyRank.fetching = true
  },
  GET_PURCHASERANK_FAILURE (state) {
    state.purchaseApplyRank.fetching = false
  },
  GET_PURCHASERANK_SUCCESS (state, result) {
    state.purchaseApplyRank.fetching = false
    state.purchaseApplyRank.data = result
  }
}

