import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/sso/privilege/inner/otherLogin',
    method: 'post',
    data: params
  })
}
export function logout(params) {
  return request({
    url: '/sso/privilege/inner/otherlogout',
    method: 'post',
    data: params
  })
}
// 单点登录
export function queryMenus(params) {
  return request({
    url: '/sso/common/queryUserMenuAndButton',
    method: 'post',
    data: params
  })
}
// 修改密码
export function changePwd(params) {
  return request({
    url: '/sso/privilege/inner/changePwd',
    method: 'post',
    data: params
  })
}
