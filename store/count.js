export const state = () => ({
  allCount: {
    fetching: false,
    data: []
  },
  inquirySheet: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_ALLCOUNT (state) {
    state.allCount.fetching = true
  },
  GET_ALLCOUNT_FAILURE (state) {
    state.allCount.fetching = false
  },
  GET_ALLCOUNT_SUCCESS (state, result) {
    state.allCount.fetching = false
    state.allCount.data = result
  },
  REQUEST_INQUIRYSHEET (state) {
    state.inquirySheet.fetching = true
  },
  GET_INQUIRYSHEET_FAILURE (state) {
    state.inquirySheet.fetching = false
  },
  GET_INQUIRYSHEET_SUCCESS (state, result) {
    state.inquirySheet.fetching = false
    state.inquirySheet.data = result
  }
}
