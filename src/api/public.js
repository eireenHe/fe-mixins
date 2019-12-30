import request from '@/utils/request'

// 下拉框所有产品
export function getAllProducts(params) {
  return request({
    url: `/openapi/v1.1/allProducts/${params.type}`,
    method: 'get'
  })
}
// 下拉框所有业务线
export function getSpuIds() {
  return request({
    url: '/openapi/v1.1/getSpuIds',
    method: 'get'
  })
}
// 下拉框所有业务场景
export function getBusinessPhases() {
  return request({
    url: '/openapi/v1.1/getBusinessPhases',
    method: 'get'
  })
}
// 下拉框所有查询来源系统
export function getChannels() {
  return request({
    url: '/openapi/v1.1/getChannels',
    method: 'get'
  })
}
// 获取所有查询要件
export function queryparameters() {
  return request({
    url: '/openapi/v1.1/product/queryparameters',
    method: 'get'
  })
}
// 下拉框所有征信产品主要类型
export function getMainTypes() {
  return request({
    url: '/openapi/v1.1/mainTypes',
    method: 'get'
  })
}
