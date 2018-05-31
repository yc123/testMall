const key = 'auth'

export const getAuthInfo = () => {
  const auth = window.localStorage.getItem(key)
  return auth ? JSON.parse(auth) : undefined
}

export const setAuthInfo = (auth) => {
  window.localStorage.setItem(key, JSON.stringify(auth))
}
