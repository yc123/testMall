/**
 * 店铺推荐信息
 */
export const state = () => ({
  products: {
    fetching: false,
    data: []
  }
})

export const mutations = {
  REQUEST_PRODUCTS (state) {
    state.products.fetching = true
  },
  GET_PRODUCTS_FAILURE (state) {
    state.products.fetching = false
  },
  GET_PRODUCTS_SUCCESS (state, result = []) {
    state.products.fetching = false
    state.products.data = result
  }
}
