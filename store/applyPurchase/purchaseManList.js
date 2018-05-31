export const state = () => ({
  purchaseHomeList: {
    fetching: false,
    data: []
  },
  purchaseManList: {
    fetching: false,
    data: []
  },
  purchaseManDetail: {
    fetching: false,
    data: []
  },
  vendorInquiryDetail: {
    fetching: false,
    data: []
  },
  buyerInquiryDetail: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_MOBILE_HOME_SEEK (state) {
    state.purchaseHomeList.fetching = true
  },
  GET_MOBILE_HOME_SEEK_FAILURE (state) {
    state.purchaseHomeList.fetching = false
  },
  GET_MOBILE_HOME_SEEK_SUCCESS (state, result) {
    state.purchaseHomeList.fetching = false
    state.purchaseHomeList.data = result
  },
  REQUEST_PURCHASEMAN (state) {
    state.purchaseManList.fetching = true
  },
  GET_PURCHASEMAN_FAILURE (state) {
    state.purchaseManList.fetching = false
  },
  GET_PURCHASEMAN_SUCCESS (state, result) {
    state.purchaseManList.fetching = false
    state.purchaseManList.data = result
  },
  REQUEST_PURCHASEMAN_DETAIL (state) {
    state.purchaseManDetail.fetching = true
  },
  GET_PURCHASEMAN_DETAIL_FAILURE (state) {
    state.purchaseManDetail.fetching = false
  },
  GET_PURCHASEMAN_DETAIL_SUCCESS (state, result) {
    state.purchaseManDetail.fetching = false
    state.purchaseManDetail.data = result
  },
  REQUEST_VENDOR_INQUIRY_DETAIL (state) {
    state.vendorInquiryDetail.fetching = true
  },
  GET_VENDOR_INQUIRY_DETAIL_FAILURE (state) {
    state.vendorInquiryDetail.fetching = false
  },
  GET_VENDOR_INQUIRY_DETAIL_SUCCESS (state, result) {
    state.vendorInquiryDetail.fetching = false
    state.vendorInquiryDetail.data = result
  },
  REQUEST_BUYER_INQUIRY_DETAIL (state) {
    state.buyerInquiryDetail.fetching = true
  },
  GET_BUYER_INQUIRY_DETAIL_FAILURE (state) {
    state.buyerInquiryDetail.fetching = false
  },
  GET_BUYER_INQUIRY_DETAIL_SUCCESS (state, result) {
    state.buyerInquiryDetail.fetching = false
    state.buyerInquiryDetail.data = result
  }
}

