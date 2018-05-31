import { getAuthInfo } from '~/utils/client-auth'

export default function ({ isServer, store, req }) {
  // If nuxt generate, pass this middleware
  if (isServer && !req) return
  if (isServer) {
    store.dispatch('loadUserInfo')
  } else {
    getAuthInfo()
    // const loggedUser = getAuthInfo()
    // store.commit('option/REQUEST_USER_INFO_SUCCESS', loggedUser)
  }
}
