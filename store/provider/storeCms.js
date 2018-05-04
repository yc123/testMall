export const state = () => ({
  salesStores: {
    fetching: false,
    data: []
  },
  newStores: {
    fetching: false,
    data: []
  },
  storeCount: {
    fetching: false,
    data: 0
  },
  recommendStore: {
    fetching: false,
    data: []
  },
  hotComponents: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_SALES (state) {
    state.salesStores.fetching = true
  },
  GET_SALES_FAILURE (state) {
    state.salesStores.fetching = false
  },
  GET_SALES_SUCCESS (state, result) {
    state.salesStores.fetching = false
    state.salesStores.data = result
  },
  REQUEST_NEW_STORES (state) {
    state.newStores.fetching = true
  },
  GET_NEW_STORES_FAILURE (state) {
    state.newStores.fetching = false
  },
  GET_NEW_STORES_SUCCESS (state, result) {
    state.newStores.fetching = false
    state.newStores.data = result
  },
  REQUEST_STORE_COUNT (state) {
    state.storeCount.fetching = true
  },
  GET_STORE_COUNT_FAILURE (state) {
    state.storeCount.fetching = false
  },
  GET_STORE_COUNT_SUCCESS (state, result) {
    state.storeCount.fetching = false
    state.storeCount.data = result
  },
  REQUEST_RECOMMEND_STORE (state) {
    state.recommendStore.fetching = true
  },
  GET_RECOMMEND_STORE_FAILURE (state) {
    state.recommendStore.fetching = false
  },
  GET_RECOMMEND_STORE_SUCCESS (state, result) {
    state.recommendStore.fetching = false
    state.recommendStore.data = result
  },
  REQUEST_HOT_COMPONENTS (state) {
    state.hotComponents.fetching = true
  },
  GET_HOT_COMPONENTS_FAILURE (state) {
    state.hotComponents.fetching = false
  },
  GET_HOT_COMPONENTS_SUCCESS (state, result) {
    state.hotComponents.fetching = false
    state.hotComponents.data = result
  }
}
