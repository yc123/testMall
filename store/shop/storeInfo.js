/**
 * 店铺状态信息
 */
export const state = () => ({
  store: {
    fetching: false,
    data: {}
  },
  commodity: {
    fetching: false,
    data: {}
  },
  component: {
    fetching: false,
    data: {}
  },
  storeCommodity: {
    fetching: false,
    data: {}
  },
  saveHistory: {
    fetching: false,
    data: {}
  },
  focus: {
    fetching: false,
    data: {}
  },
  focusList: {
    fetching: false,
    data: {}
  },
  focusPage: {
    fetching: false,
    data: {}
  }
})

export const mutations = {
  REQUEST_STORE_INFO (state) {
    state.store.fetching = true
  },
  GET_STORE_INFO_FAILURE (state) {
    state.store.fetching = false
  },
  GET_STORE_INFO_SUCCESS (state, result = {}) {
    state.store.fetching = false
    state.store.data = result
  },
  REQUEST_COMMODITY (state) {
    state.commodity.fetching = true
  },
  GET_COMMODITY_FAILURE (state) {
    state.commodity.fetching = false
  },
  GET_COMMODITY_SUCCESS (state, result = {}) {
    state.commodity.fetching = false
    state.commodity.data = result
  },
  REQUEST_COMPONENT (state) {
    state.component.fetching = true
  },
  GET_COMPONENT_FAILURE (state) {
    state.component.fetching = false
  },
  GET_COMPONENT_SUCCESS (state, result = {}) {
    state.component.fetching = false
    state.component.data = result
  },
  REQUEST_STORE_COMMODITY (state) {
    state.storeCommodity.fetching = true
  },
  GET_STORE_COMMODITY_FAILURE (state) {
    state.storeCommodity.fetching = false
  },
  GET_STORE_COMMODITY_SUCCESS (state, result = {}) {
    state.storeCommodity.fetching = false
    state.storeCommodity.data = result
  },
  REQUEST_SAVEHISOTRY (state) {
    state.saveHistory.fetching = true
  },
  GET_SAVEHISOTRY_FAILURE (state) {
    state.saveHistory.fetching = false
  },
  GET_SAVEHISOTRY_SUCCESS (state, result) {
    state.saveHistory.fetching = false
    state.saveHistory.data = result
  },
  REQUEST_FOCUS (state) {
    state.focus.fetching = true
  },
  GET_FOCUS_FAILURE (state) {
    state.focus.fetching = false
  },
  GET_FOCUS_SUCCESS (state, result) {
    state.focus.fetching = false
    state.focus.data = result
  },
  REQUEST_FOCUSLIST (state) {
    state.focusList.fetching = true
  },
  GET_FOCUSLIST_FAILURE (state) {
    state.focusList.fetching = false
  },
  GET_FOCUSLIST_SUCCESS (state, result) {
    state.focusList.fetching = false
    state.focusList.data = result
  },
  REQUEST_FOCUSPAGE (state) {
    state.focusPage.fetching = true
  },
  GET_FOCUSPAGE_SUCCESS (state, result) {
    state.focusPage.fetching = false
    state.focusPage.data = result
  },
  GET_FOCUSPAGE_FAILURE (state) {
    state.focusPage.fetching = false
  }
}
