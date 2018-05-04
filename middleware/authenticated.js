export default function ({ isServer, store, req, redirect, route }) {
  // If nuxt generate, pass this middleware
  if (isServer && !req) return
  if (!store.state.option.user.logged) {
    return redirect('/auth/login')
  }
}
