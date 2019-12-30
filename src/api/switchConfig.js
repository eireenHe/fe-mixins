import request from '@/utils/request'

// 分页查询列表
export function getSwitches(params) {
  return request({
    url: '/openapi/v1.1/getSwitches',
    method: 'get',
    params
  })
}
// 新增时效配置
export function createSwitches(params) {
	return request({
		url: '/openapi/v1.1/createSwitches',
		method: 'post',
		data: params
	})
}
// 更新时效配置
export function updateSwitchInfos(params) {
	return request({
		url:'/openapi/v1.1/updateSwitchInfos',
		method: 'post',
		data: {
			duration: params.duration,
			id: params.id,
			unit: params.unit
		}
	})
}
// 更新启用停用状态
export function updateSwitch(params) {
	return request({
		url: `/openapi/v1.1/updateSwitch/${params.id}/${params.isOpen}`,
		method: 'post',
		data: params
	})
}
// 删除时效配置
export function deleteSwitch(params) {
	return request({
		url: `/openapi/v1.1/deleteSwitch/${params.id}`,
		method: 'delete'
	})
}
