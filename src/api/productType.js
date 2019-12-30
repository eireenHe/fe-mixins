import request from '@/utils/request'

// 分页查询列表
export function getProductTypes(params) {
    return request({
        url: '/openapi/v1.1/productTypes',
        method: 'get',
        params
    })
}

// 新增产品类型
export function createProductType(params) {
    return request({
        url: '/openapi/v1.1/productType',
        method: 'post',
        data: params
    })
}
// 更新产品类型
export function updateProductType(params) {
    return request({
        url:'/openapi/v1.1/productType',
        method: 'put',
        data: params
    })
}
// 删除产品类型
export function deleteProductType(params) {
    return request({
        url:'/openapi/v1.1/productType',
        method: 'delete',
        params
    })
}
