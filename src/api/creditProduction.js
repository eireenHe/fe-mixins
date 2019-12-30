import request from '@/utils/request'

// 获取所有主要类型列表
export function getMainTypes() {
  return request({
    url: '/openapi/v1.1/mainTypes',
    method: 'get'
  })
}
// 次要类型列表
export function getSecondTypes(params) {
  return request({
    url: '/openapi/v1.1/secondTypes',
    method: 'get',
    params
  })
}
// 获取所有供应商列表
export function getSuppliers() {
  return request({
    url: '/openapi/v1.1/allSuppliers',
    method: 'get'
  })
}
// 分页查询产品列表
export function getProducts(params) {
  return request({
    url: '/openapi/v1.1/products',
    method: 'get',
    params
  })
}
// 添加产品
export function createProduct(params) {
  return request({
    url: '/openapi/v1.1/product',
    method: 'post',
    data: params
  })
}
// 添加产品
export function updateProduct(params) {
  return request({
    url: '/openapi/v1.1/product',
    method: 'put',
    data: params
  })
}
// 更新产品状态
export function updateProductStatus(params) {
  return request({
    url: '/openapi/v1.1/product/updateStatus',
    method: 'get',
    params
  })
}
// 导出
export function exportProducts(params) {
  return request({
    url: '/openapi/v1.1/products/export',
    method: 'post',
    data: params
  })
}
// 查询当前整合类产品的非整合产品
export function getExsitProducts(id) {
  return request({
    url: `/openapi/v1.1/product/${id}`,
    method: 'get'
  })
}
