import request from '@/utils/request'

// 分页查询列表
export function getZhRoutes(params) {
  return request({
    url: '/openapi/v1.1/getZhRoutes',
    method: 'get',
    params
  })
}
// 新增整合接口路由配置
export function createZhRoutes(params) {
	return request({
		url: '/openapi/v1.1/createZhRoutes',
		method: 'post',
		data: params
	})
}
// 更新整合接口路由配置
export function updateZhRoute(params) {
	return request({
		url:'/openapi/v1.1/updateZhRoute',
		method: 'post',
		data: params.routeInfos
	})
}
// 查询整合产品依赖关系
export function getZhRelyon(params) {
	return request({
		url: '/openapi/v1.1/getZhRelyon',
		method: 'get',
		params
	})
}
// 删除时效配置
export function deleteZhRoute(params) {
	return request({
		url: '/openapi/v1.1/deleteZhRoute',
		method: 'delete',
		data: params.ids
	})
}
