import request from '@/utils/request'

// 分页查询列表
export function getSuppliers(params) {
    return request({
        url: '/openapi/v1.1/suppliers',
        method: 'get',
        params
    })
}

// 新增供应商
export function createSupplier(params) {
    return request({
        url: '/openapi/v1.1/supplier',
        method: 'post',
        data: params
    })
}
// 更新供应商
export function updateSupplier(params) {
    return request({
        url:'/openapi/v1.1/supplier',
        method: 'put',
        data: params
    })
}
// 停用/启用供应商
export function updateStatus(params) {
    return request({
        url:'/openapi/v1.1/supplier/updateStatus',
        method: 'get',
        params
    })
}
