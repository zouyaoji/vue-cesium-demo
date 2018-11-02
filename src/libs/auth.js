const TokenKey = 'cesium'

export function getToken () {
  // return localStorage.getItem(TokenKey)
  return true
}

export function setToken (token) {
  localStorage.setItem(TokenKey, token)
}

export function removeToken () {
  localStorage.removeItem(TokenKey)
}
