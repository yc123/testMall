export const state = () => ({
  detail: {
    fetching: false,
    data: []
  },
  cmpInfo: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_DETAIL (state) {
    state.detail.detching = true
  },
  GET_DETAIL_SUCCESS (state, result) {
    state.detail.fetching = false
    state.detail.data = result
  },
  GET_DETAIL_FAILURE (state) {
    state.detail.fetching = false
  },
  REQUEST_CMPINFO (state) {
    state.cmpInfo.detching = true
  },
  GET_CMPINFO_SUCCESS (state, result) {
    state.cmpInfo.fetching = false
    state.cmpInfo.data = result
  },
  GET_CMPINFO_FAILURE (state) {
    state.cmpInfo.fetching = false
  }
}
