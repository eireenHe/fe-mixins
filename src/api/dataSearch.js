import request from '@/utils/request'
import qs from 'qs'

// 分页查询批量查询记录信息列表
export function getBatchRecords(params) {
  return request({
    url: '/openapi/v1.1/batchRecords',
    method: 'get',
    params
  })
}
// 获取指定批次号任务状态信息
export function getStatusDetail(params) {
  return request({
    url: '/openapi/v1.1/batchRecords/status=true',
    method: 'get',
    params
  })
}
// 获取指定批次对应的记录
export function getRecords(params) {
  return request({
    url: '/openapi/v1.1/detailRecords',
    method: 'get',
    params
  })
}
// 获取数据产品列表
export function getProducts(params) {
  return request({
    url: '/openapi/v1.1/suppliers/products',
    method: 'get',
    params
  })
}
// 获取指定产品要件信息
export function getProductsParameters(params) {
  return request({
    url: '/openapi/v1.1/productParameters',
    method: 'post',
    data: params
  })
}
// 导出报表
export function exportReport(params) {
  return request({
    url: '/openapi/v1.1/exportExcel',
    method: 'post',
    responseType: 'blob',
    data: params
  })
}
// 确定执行批量查询任务
export function executeTasks(params) {
  return request({
    url: '/openapi/v1.1/executeBatchTask',
    method: 'get',
    params
  })
}
// 获取指定批次信息
export function getBatchInfo(params) {
  return request({
    url: '/openapi/v1.1/batchRecord',
    method: 'get',
    params
  })
}
// 删除批次任务
export function deleteRecord(params) {
  return request({
    url: '/openapi/v1.1/batchRecord',
    method: 'delete',
    params
  })
}
// 保存批量查询
export function saveBatchTask(params) {
  return request({
    url: '/openapi/v1.1/saveBatchTask',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data: qs.stringify(params)
  })
}
