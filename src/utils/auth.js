import Cookies from 'js-cookie'

const TokenKey = 'accessToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setCookie(name, value) {
  var domain = location.hostname.includes('mljr.com') ? 'mljr.com' : location.hostname
  var Days = 7
  var exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';domain=' + domain
}

export function getCookie(name) {
  var arr
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2])
  } else {
    return null
  }
}

export function delCookie(name) {
  var d = new Date()
  d.setTime(d.getTime() + (-1 * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  var domain = location.hostname.includes('mljr.com') ? 'mljr.com' : location.hostname
  document.cookie = name + '=' + '' + '; ' + expires + ';domain=' + domain
}

